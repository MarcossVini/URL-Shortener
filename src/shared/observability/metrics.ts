import type { Request, Response, NextFunction } from 'express';

// Sistema de métricas simples para observabilidade
export interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: Date;
}

class MetricsCollector {
  private metrics: Map<string, Metric[]> = new Map();
  private counters: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  // Incrementa um contador
  incrementCounter(name: string, labels: Record<string, string> = {}) {
    const key = this.createKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + 1);

    this.addMetric({
      name,
      value: current + 1,
      labels,
      timestamp: new Date(),
    });
  }

  // Adiciona valor a um histograma (para métricas de tempo)
  addToHistogram(name: string, value: number, labels: Record<string, string> = {}) {
    const key = this.createKey(name, labels);
    const current = this.histograms.get(key) || [];
    current.push(value);
    this.histograms.set(key, current);

    this.addMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  // Registra um gauge (valor instantâneo)
  setGauge(name: string, value: number, labels: Record<string, string> = {}) {
    this.addMetric({
      name,
      value,
      labels,
      timestamp: new Date(),
    });
  }

  private createKey(name: string, labels: Record<string, string>): string {
    const labelStr = Object.entries(labels)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  private addMetric(metric: Metric) {
    const metrics = this.metrics.get(metric.name) || [];
    metrics.push(metric);

    // Manter apenas os últimos 1000 registros por métrica
    if (metrics.length > 1000) {
      metrics.shift();
    }

    this.metrics.set(metric.name, metrics);
  }

  // Obter estatísticas de uma métrica
  getMetricStats(name: string) {
    const metrics = this.metrics.get(name) || [];
    if (metrics.length === 0) return null;

    const values = metrics.map((m) => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      sum,
      avg,
      min,
      max,
      latest: values[values.length - 1],
    };
  }

  // Obter todas as métricas
  getAllMetrics(): Record<string, Metric[]> {
    return Object.fromEntries(this.metrics);
  }

  // Limpar métricas antigas
  clearOldMetrics(olderThanMinutes: number = 60) {
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);

    for (const [name, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter((m) => m.timestamp > cutoff);
      this.metrics.set(name, filtered);
    }
  }
}

// Instância singleton do coletor de métricas
export const metrics = new MetricsCollector();

// Funções de conveniência para métricas comuns da aplicação
export const AppMetrics = {
  // Contadores de URLs
  urlCreated: (userId?: string) => {
    metrics.incrementCounter('urls_created_total', {
      user_type: userId ? 'authenticated' : 'anonymous',
    });
  },

  urlAccessed: (shortCode: string) => {
    metrics.incrementCounter('urls_accessed_total', { shortCode });
  },

  // Métricas de autenticação
  userLogin: (successful: boolean) => {
    metrics.incrementCounter('user_logins_total', {
      status: successful ? 'success' : 'failure',
    });
  },

  // Métricas de HTTP
  httpRequest: (method: string, path: string, statusCode: number, duration: number) => {
    metrics.incrementCounter('http_requests_total', {
      method,
      path,
      status_code: statusCode.toString(),
    });

    metrics.addToHistogram('http_request_duration_ms', duration, {
      method,
      path,
    });
  },

  // Métricas de banco de dados
  databaseOperation: (operation: string, table: string, duration: number) => {
    metrics.incrementCounter('database_operations_total', {
      operation,
      table,
    });

    metrics.addToHistogram('database_operation_duration_ms', duration, {
      operation,
      table,
    });
  },

  // Métricas de erro
  error: (type: string, operation: string) => {
    metrics.incrementCounter('errors_total', {
      type,
      operation,
    });
  },
};

// Middleware para coleta automática de métricas HTTP
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    AppMetrics.httpRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
  });

  next();
};

// Endpoint para expor métricas (formato simples)
export const getMetricsEndpoint = (req: Request, res: Response) => {
  const allMetrics = metrics.getAllMetrics();
  const summary: Record<string, unknown> = {};

  for (const [name] of Object.entries(allMetrics)) {
    summary[name] = metrics.getMetricStats(name);
  }

  res.json({
    timestamp: new Date().toISOString(),
    metrics: summary,
  });
};

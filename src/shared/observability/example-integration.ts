// Exemplo de como integrar observabilidade no servidor principal
import express from 'express';
import { logger, requestLogger } from './logger';
import { metricsMiddleware, getMetricsEndpoint } from './metrics';

const app = express();

// Middlewares de observabilidade devem ser adicionados no início
app.use(requestLogger);
app.use(metricsMiddleware);

// Endpoint para métricas (para monitoramento)
app.get('/metrics', getMetricsEndpoint);

// Endpoint para health check com métricas
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  logger.info('Health check requested', {
    operation: 'health_check',
    uptime,
    memoryUsage: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
    },
  });

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    },
  });
});

export { app };

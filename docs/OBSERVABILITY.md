# 🔍 Sistema de Observabilidade - Shortener API

## Visão Geral

O sistema de observabilidade implementado na Shortener API fornece **logs estruturados**, **métricas de desempenho** e **rastreamento de operações** para monitoramento em produção.

## 📊 Componentes Implementados

### 1. **Logging Estruturado** (`src/shared/observability/logger.ts`)

#### Recursos:

- **Logs em formato JSON** para análise automatizada
- **Contexto de requisição** (requestId, userId, IP)
- **Níveis de log configuráveis** (debug, info, warn, error)
- **Métodos específicos para eventos de negócio**

#### Exemplo de Uso:

```typescript
import { ContextLogger } from '../shared/observability/logger';

const logger = new ContextLogger({
  requestId: 'req-123',
  userId: 'user-456',
  operation: 'url_creation',
});

logger.urlCreated('abc123', 'https://example.com', 'user-456');
logger.error('Validation failed', { error: 'Invalid URL format' });
```

#### Estrutura do Log:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "URL created successfully",
  "service": "shortener-api",
  "environment": "production",
  "requestId": "req-123",
  "userId": "user-456",
  "operation": "url_creation",
  "shortCode": "abc123",
  "originalUrl": "https://example.com"
}
```

### 2. **Sistema de Métricas** (`src/shared/observability/metrics.ts`)

#### Tipos de Métricas:

- **Contadores**: Eventos que só aumentam (URLs criadas, logins)
- **Histogramas**: Distribuição de valores (tempo de resposta)
- **Gauges**: Valores instantâneos (uso de memória)

#### Métricas Pré-definidas:

```typescript
import { AppMetrics } from '../shared/observability/metrics';

// Contadores de URLs
AppMetrics.urlCreated('user-123'); // URLs criadas
AppMetrics.urlAccessed('abc123'); // URLs acessadas

// Métricas de autenticação
AppMetrics.userLogin(true); // Login bem-sucedido
AppMetrics.userLogin(false); // Login falhado

// Métricas HTTP
AppMetrics.httpRequest('GET', '/api/urls', 200, 150);

// Métricas de erro
AppMetrics.error('validation', 'url_creation');
```

### 3. **Middlewares de Observabilidade**

#### Request Logger Middleware:

```typescript
import { requestLogger } from '../shared/observability/logger';

app.use(requestLogger);
```

#### Metrics Middleware:

```typescript
import { metricsMiddleware } from '../shared/observability/metrics';

app.use(metricsMiddleware);
```

## 🛠️ Integração no Projeto

### 1. **No Middleware de Autenticação** (Já implementado)

```typescript
// Log de eventos de autenticação
logger.userAuthenticated(decoded.sub);
logger.authenticationFailed(email, 'Token inválido');

// Métricas de login
AppMetrics.userLogin(true); // Sucesso
AppMetrics.userLogin(false); // Falha
```

### 2. **Nos Controllers**

```typescript
export class CreateShortUrlController {
  async handle(req: Request, res: Response) {
    const startTime = Date.now();

    try {
      // Lógica do controller...

      req.logger?.urlCreated(shortCode, originalUrl, userId);
      AppMetrics.urlCreated(userId);

      const duration = Date.now() - startTime;
      req.logger?.operationTimed('url_creation', duration);
    } catch (error) {
      req.logger?.error('URL creation failed', { error: error.message });
      AppMetrics.error('url_creation', 'controller');
    }
  }
}
```

### 3. **No Servidor Principal**

```typescript
import { requestLogger } from './shared/observability/logger';
import { metricsMiddleware, getMetricsEndpoint } from './shared/observability/metrics';

// Adicionar middlewares de observabilidade
app.use(requestLogger);
app.use(metricsMiddleware);

// Endpoint para métricas
app.get('/metrics', getMetricsEndpoint);
```

## 📈 Endpoints de Monitoramento

### 1. **Health Check** (`GET /health`)

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": "128MB",
    "heapTotal": "89MB",
    "heapUsed": "56MB"
  }
}
```

### 2. **Métricas** (`GET /metrics`)

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metrics": {
    "urls_created_total": {
      "count": 1500,
      "sum": 1500,
      "avg": 1,
      "min": 1,
      "max": 1,
      "latest": 1
    },
    "http_request_duration_ms": {
      "count": 5000,
      "sum": 125000,
      "avg": 25,
      "min": 5,
      "max": 500,
      "latest": 23
    }
  }
}
```

## 🚀 Benefícios da Implementação

### 1. **Debugging em Produção**

- Logs estruturados facilitam a busca por problemas específicos
- Contexto de requisição permite rastrear o fluxo completo
- RequestID permite correlacionar logs entre serviços

### 2. **Monitoramento de Performance**

- Métricas de tempo de resposta por endpoint
- Identificação de gargalos de performance
- Monitoramento de uso de recursos

### 3. **Alertas Proativos**

- Contadores de erro para detecção de problemas
- Métricas de SLA (tempo de resposta, disponibilidade)
- Monitoramento de comportamento anômalo

### 4. **Análise de Negócio**

- Tracking de uso de features (URLs criadas, acessos)
- Padrões de comportamento de usuários
- Análise de crescimento e engagement

## 🔧 Configuração de Produção

### 1. **Variáveis de Ambiente**

```bash
LOG_LEVEL=info                    # Nível de log
ENABLE_OBSERVABILITY=true         # Ativar observabilidade
```

### 2. **Integração com Ferramentas Externas**

#### **Para Logs (ELK Stack, Grafana Loki)**:

- Configurar output de logs para stdout (já implementado)
- Usar collectors como Fluentd ou Vector
- Centralizar logs em Elasticsearch ou Loki

#### **Para Métricas (Prometheus + Grafana)**:

- Endpoint `/metrics` em formato Prometheus
- Configurar scraping automático
- Dashboards no Grafana para visualização

## 📋 Próximos Passos

### **Fase 6 - CI/CD e Deploy**:

1. **GitHub Actions** para CI/CD
2. **Terraform** para infraestrutura
3. **Kubernetes** para deployment
4. **Alerting** baseado em métricas

### **Melhorias Futuras**:

1. **Distributed Tracing** (OpenTelemetry)
2. **Custom Dashboards** no Grafana
3. **Alertas Inteligentes** baseados em ML
4. **Performance Profiling** automático

## 🎯 Status Atual: Fase 5 - 80% Concluída

✅ **Concluído**:

- Sistema de logging estruturado
- Coleta de métricas abrangente
- Middlewares de observabilidade
- Integração com autenticação
- Endpoints de monitoramento

⚠️ **Pendente**:

- Testes unitários/integração completos
- Documentação Swagger atualizada
- Integração completa no servidor principal

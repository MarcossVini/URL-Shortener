// Inicializa tracing distribuído (OpenTelemetry)
import './config/tracing';
// Inicia tracing antes de qualquer outra importação para instrumentação correta
import './config/tracing';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { metricsMiddleware, getMetricsEndpoint } from './shared/observability/metrics';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { specs } from './config/swagger';
import { authRoutes } from './features/auth/routes/auth.routes';
import { shortenRoutes } from './features/shorten/routes/shorten.routes';
import { userRoutes } from './features/shorten/routes/user.routes';

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());
// Middleware de métricas
app.use(metricsMiddleware);

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Shortener API Documentation',
  }),
);

// Rotas
/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Expor métricas da aplicação
 *     tags: [Observability]
 *     responses:
 *       200:
 *         description: Métricas no formato JSON
 */
app.get('/metrics', getMetricsEndpoint);

// Rota raiz - redireciona para documentação
/**
 * @swagger
 * /:
 *   get:
 *     summary: Página inicial da API
 *     description: Redireciona para a documentação da API
 *     tags: [System]
 *     responses:
 *       302:
 *         description: Redirecionamento para documentação
 */
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/auth', authRoutes);
app.use('/shorten', shortenRoutes);
app.use('/user', userRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Verifica o status da aplicação
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Aplicação funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Expose Express app for serverless platforms (e.g., Vercel)
export default app;

// If running locally (not on Vercel), start the server
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(` Environment: ${env.NODE_ENV}`);
    console.log(`📚 API Documentation: http://localhost:${env.PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${env.PORT}/health`);
  });
}

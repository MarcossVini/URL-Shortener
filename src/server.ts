// Inicializa tracing distribuído (OpenTelemetry)
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

// Catch uncaught exceptions and unhandled rejections in serverless environment
if (process.env.VERCEL) {
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception in serverless:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

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

// Rota de redirecionamento deve vir após as rotas específicas
/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirecionar URL
 *     description: Redireciona para a URL original baseada no código encurtado
 *     tags: [URL Shortening]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da URL encurtada
 *         example: abc123
 *     responses:
 *       200:
 *         description: URL encontrada (localização em JSON)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                   example: https://www.google.com
 *       302:
 *         description: Redirecionamento para URL original
 *       404:
 *         description: URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/:shortCode', (req, res, next) => {
  const { shortCode } = req.params;

  // Evitar conflitos com rotas específicas já definidas
  if (
    ['auth', 'shorten', 'user', 'health', 'metrics', 'api-docs', 'favicon.ico'].includes(shortCode)
  ) {
    return next();
  }

  // Importar e usar o RedirectController
  const { RedirectController } = require('./features/shorten/useCases/redirect/RedirectController');
  const redirectController = new RedirectController();
  return redirectController.handle(req, res);
});

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

// Global error handler for unhandled exceptions
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error in serverless function:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
  next(error); // Pass error to next middleware
});

// Handle 404s
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
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

// Inicializa tracing distribuído (OpenTelemetry)
import './config/tracing';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { metricsMiddleware, getMetricsEndpoint } from './shared/observability/metrics';
import { env } from './config/env';
import { specs } from './config/swagger';
import { authRoutes } from './features/auth/routes/auth.routes';
import { shortenRoutes } from './features/shorten/routes/shorten.routes';
import { userRoutes } from './features/shorten/routes/user.routes';

// Import Swagger UI - always available
import swaggerUi from 'swagger-ui-express';

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

// Swagger Documentation - Available in all environments
// Serve static files first for Swagger UI assets
if (process.env.VERCEL) {
  // In serverless environment, create custom swagger UI HTML
  app.get('/api-docs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Shortener API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        background: #fafafa;
      }
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title { color: #3b82f6; font-size: 36px; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: window.location.origin + '/api-docs/swagger.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          persistAuthorization: true,
          displayRequestDuration: true,
          filter: true,
          showExtensions: true,
          showCommonExtensions: true
        });
      };
    </script>
  </body>
</html>`;
    res.set('Content-Type', 'text/html').send(html);
  });

  // Serve the OpenAPI spec as JSON
  app.get('/api-docs/swagger.json', (req, res) => {
    res.set('Content-Type', 'application/json').send(specs);
  });
} else {
  // In development, use the standard swagger-ui-express
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 50px 0; }
        .swagger-ui .info .title { color: #3b82f6; font-size: 36px; }
      `,
      customSiteTitle: 'Shortener API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
    }),
  );
}

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

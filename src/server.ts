import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

// Swagger Documentation
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Shortener API Documentation',
  }),
);

// Rotas
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

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(` Environment: ${env.NODE_ENV}`);
  console.log(`📚 API Documentation: http://localhost:${env.PORT}/docs`);
  console.log(`🏥 Health Check: http://localhost:${env.PORT}/health`);
});

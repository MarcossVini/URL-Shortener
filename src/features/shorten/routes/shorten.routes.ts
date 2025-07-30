import { Router } from 'express';
import { CreateShortUrlController } from '../useCases/createShortUrl/CreateShortUrlController';
import { optionalAuthMiddleware } from '../../../shared/middlewares/authMiddleware';
import { validateRequest } from '../../../shared/middlewares/validationMiddleware';
import { createShortUrlSchema } from '../dto/CreateShortUrlDTO';

const router = Router();
const createController = new CreateShortUrlController();

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Encurtar URL
 *     description: Cria uma URL encurtada. Autenticação é opcional.
 *     tags: [URL Shortening]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShortUrlRequest'
 *     responses:
 *       201:
 *         description: URL encurtada criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateShortUrlResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  optionalAuthMiddleware,
  validateRequest(createShortUrlSchema),
  createController.handle,
);

export { router as shortenRoutes };

import { Router } from 'express';
import { CreateShortUrlController } from '../useCases/createShortUrl/CreateShortUrlController';
import { RedirectController } from '../useCases/redirect/RedirectController';
import { optionalAuthMiddleware } from '../../../shared/middlewares/authMiddleware';
import { validateRequest } from '../../../shared/middlewares/validationMiddleware';
import { createShortUrlSchema } from '../dto/CreateShortUrlDTO';

const router = Router();
const createController = new CreateShortUrlController();
const redirectController = new RedirectController();

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

/**
 * @swagger
 * /shorten/{shortCode}:
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
 *       301:
 *         description: Redirecionamento para URL original
 *       404:
 *         description: URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:shortCode', redirectController.handle);

export { router as shortenRoutes };

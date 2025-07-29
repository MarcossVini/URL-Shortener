import { Router } from 'express';
import { ListUserUrlsController } from '../useCases/listUserUrls/ListUserUrlsController';
import { UpdateShortUrlController } from '../useCases/updateShortUrl/UpdateShortUrlController';
import { DeleteShortUrlController } from '../useCases/deleteShortUrl/DeleteShortUrlController';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { validateRequest } from '../../../shared/middlewares/validationMiddleware';
import { updateShortUrlSchema } from '../dto/UpdateShortUrlDTO';

const router = Router();
const listUserUrlsController = new ListUserUrlsController();
const updateShortUrlController = new UpdateShortUrlController();
const deleteShortUrlController = new DeleteShortUrlController();

/**
 * @swagger
 * /user/urls:
 *   get:
 *     summary: Listar URLs do usuário
 *     description: Lista todas as URLs encurtadas do usuário autenticado
 *     tags: [User URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de URLs do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUrlsResponse'
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/urls', authMiddleware, listUserUrlsController.handle);

/**
 * @swagger
 * /user/urls/{id}:
 *   patch:
 *     summary: Atualizar URL do usuário
 *     description: Atualiza a URL original de uma URL encurtada do usuário
 *     tags: [User URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da URL encurtada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShortUrlRequest'
 *     responses:
 *       200:
 *         description: URL atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateShortUrlResponse'
 *       400:
 *         description: Dados inválidos ou URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  '/urls/:id',
  authMiddleware,
  validateRequest(updateShortUrlSchema),
  updateShortUrlController.handle,
);

/**
 * @swagger
 * /user/urls/{id}:
 *   delete:
 *     summary: Deletar URL do usuário
 *     description: Deleta uma URL encurtada do usuário (soft delete)
 *     tags: [User URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da URL encurtada
 *     responses:
 *       200:
 *         description: URL deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUrlResponse'
 *       400:
 *         description: URL não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/urls/:id', authMiddleware, deleteShortUrlController.handle);

export { router as userRoutes };

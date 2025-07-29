import { Router } from 'express';
import { LoginController } from '../useCases/login/LoginController';

const router = Router();
const loginController = new LoginController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Realiza login do usuário e retorna JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
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
router.post('/login', loginController.handle);

export { router as authRoutes };

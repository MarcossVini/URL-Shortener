import { Request, Response } from 'express';
import { LoginUseCase } from './LoginUseCase';
import { loginSchema } from '../../dto/LoginDTO';

export class LoginController {
  async handle(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const useCase = new LoginUseCase();
      const result = await useCase.execute(validatedData);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

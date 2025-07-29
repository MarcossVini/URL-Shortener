import { Request, Response } from 'express';
import { DeleteShortUrlUseCase } from './DeleteShortUrlUseCase';

export class DeleteShortUrlController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const useCase = new DeleteShortUrlUseCase();
      const result = await useCase.execute(id, userId);

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

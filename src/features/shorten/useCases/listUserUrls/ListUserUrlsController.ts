import { Request, Response } from 'express';
import { ListUserUrlsUseCase } from './ListUserUrlsUseCase';

export class ListUserUrlsController {
  async handle(req: Request, res: Response) {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const useCase = new ListUserUrlsUseCase();
      const urls = await useCase.execute(userId);

      return res.status(200).json({
        urls,
        total: urls.length,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

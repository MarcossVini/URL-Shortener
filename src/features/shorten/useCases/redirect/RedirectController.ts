import { Request, Response } from 'express';
import { RedirectUseCase } from './RedirectUseCase';

export class RedirectController {
  async handle(req: Request, res: Response) {
    try {
      const { shortCode } = req.params;
      const useCase = new RedirectUseCase();
      const originalUrl = await useCase.execute(
        shortCode,
        req.ip || req.connection.remoteAddress || '',
        req.get('User-Agent') || '',
      );

      return res.redirect(301, originalUrl);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

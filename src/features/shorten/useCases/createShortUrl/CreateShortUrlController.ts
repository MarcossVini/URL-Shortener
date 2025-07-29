import { Request, Response } from 'express';
import { CreateShortUrlUseCase } from './CreateShortUrlUseCase';

export class CreateShortUrlController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { original_url } = req.body;
      const user_id = req.user?.sub;

      const useCase = new CreateShortUrlUseCase();
      const result = await useCase.execute({ original_url, user_id });

      return res.status(201).json({
        short_url: `${process.env.BASE_URL}/${result.short_code}`,
        original_url: result.original_url,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

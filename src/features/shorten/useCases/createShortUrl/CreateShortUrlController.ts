import { Request, Response } from 'express';
import { CreateShortUrlUseCase } from './CreateShortUrlUseCase';

export class CreateShortUrlController {
  async handle(req: Request, res: Response) {
    const { original_url } = req.body;
    const user_id = req.user?.id;

    const useCase = new CreateShortUrlUseCase();
    const result = await useCase.execute({ original_url, user_id });

    return res.status(201).json({
      short_url: `${process.env.BASE_URL}/${result.short_code}`,
      original_url: result.original_url,
    });
  }
}

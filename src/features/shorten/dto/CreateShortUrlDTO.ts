import { z } from 'zod';

export const createShortUrlSchema = z.object({
  original_url: z.string().url('URL deve ser válida'),
});

export type CreateShortUrlDTO = z.infer<typeof createShortUrlSchema>;

import { z } from 'zod';

export const updateShortUrlSchema = z.object({
  original_url: z.string().url('URL deve ser válida'),
});

export type UpdateShortUrlDTO = z.infer<typeof updateShortUrlSchema>;

import { prisma } from '../../../../database/prisma';
import { UpdateShortUrlDTO } from '../../dto/UpdateShortUrlDTO';

export class UpdateShortUrlUseCase {
  async execute(urlId: string, userId: string, data: UpdateShortUrlDTO) {
    // Verificar se a URL pertence ao usuário
    const existingUrl = await prisma.shortenedUrl.findFirst({
      where: {
        id: urlId,
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!existingUrl) {
      throw new Error('URL não encontrada ou não pertence ao usuário');
    }

    // Atualizar a URL
    const updatedUrl = await prisma.shortenedUrl.update({
      where: {
        id: urlId,
      },
      data: {
        original_url: data.original_url,
        updated_at: new Date(),
      },
    });

    return {
      id: updatedUrl.id,
      original_url: updatedUrl.original_url,
      short_code: updatedUrl.short_code,
      short_url: `${process.env.BASE_URL}/${updatedUrl.short_code}`,
      updated_at: updatedUrl.updated_at,
    };
  }
}

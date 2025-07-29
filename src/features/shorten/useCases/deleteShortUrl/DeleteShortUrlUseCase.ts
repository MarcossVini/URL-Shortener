import { prisma } from '../../../../database/prisma';

export class DeleteShortUrlUseCase {
  async execute(urlId: string, userId: string) {
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

    // Soft delete - marcar como deletada
    await prisma.shortenedUrl.update({
      where: {
        id: urlId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return {
      message: 'URL deletada com sucesso',
      id: urlId,
    };
  }
}

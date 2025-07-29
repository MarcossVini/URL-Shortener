import { prisma } from '../../../../database/prisma';

export class RedirectUseCase {
  async execute(shortCode: string, ipAddress: string, userAgent: string) {
    const shortenedUrl = await prisma.shortenedUrl.findUnique({
      where: { short_code: shortCode },
    });

    if (!shortenedUrl || shortenedUrl.deleted_at) {
      throw new Error('URL não encontrada');
    }

    // Criar log de acesso
    await prisma.accessLog.create({
      data: {
        shortened_url_id: shortenedUrl.id,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    });

    return shortenedUrl.original_url;
  }
}

import { prisma } from '../../../../database/prisma';

type UrlWithAccessLogs = {
  id: string;
  original_url: string;
  short_code: string;
  created_at: Date;
  updated_at: Date;
  accessLogs: { id: string }[];
};

export class ListUserUrlsUseCase {
  async execute(userId: string) {
    const urls = await prisma.shortenedUrl.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        accessLogs: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return urls.map((url: UrlWithAccessLogs) => ({
      id: url.id,
      original_url: url.original_url,
      short_code: url.short_code,
      short_url: `${process.env.BASE_URL}/${url.short_code}`,
      click_count: url.accessLogs.length,
      created_at: url.created_at,
      updated_at: url.updated_at,
    }));
  }
}

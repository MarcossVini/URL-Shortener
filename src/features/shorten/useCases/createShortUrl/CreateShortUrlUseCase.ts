import { prisma } from '../../../../database/prisma';
import { generateShortCode } from '../../../../shared/utils/generateShortCode';

interface IRequest {
  original_url: string;
  user_id?: string | null;
}

export class CreateShortUrlUseCase {
  async execute({ original_url, user_id }: IRequest) {
    let short_code: string;
    let exists = true;

    do {
      short_code = generateShortCode();
      const url = await prisma.shortenedUrl.findUnique({ where: { short_code } });
      exists = !!url;
    } while (exists);

    const result = await prisma.shortenedUrl.create({
      data: { original_url, short_code, user_id },
    });

    return result;
  }
}

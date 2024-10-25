import { prisma } from '@repo/db';
import type { ShortURL } from '@repo/db/types';

export async function getLongURL(slug: string): Promise<ShortURL | null> {
  const url = await prisma.shortURL.findUnique({
    where: {
      shortUrlSlug: slug,
    },
  });

  return url;
}

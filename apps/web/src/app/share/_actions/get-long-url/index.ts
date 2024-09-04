import { prisma } from '@repo/db';

export async function getLongURL(slug: string): Promise<string | null> {
  const url = await prisma.shortURL.findUnique({
    where: {
      shortUrlSlug: slug,
    },
  });
  if (url) {
    return url.originalUrl;
  }
  return null;
}

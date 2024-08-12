import { prisma } from '@repo/db';

export async function updateClickCount(slug: string): Promise<void> {
  await prisma.shortURL.update({
    where: {
      shortUrlSlug: slug,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });
}

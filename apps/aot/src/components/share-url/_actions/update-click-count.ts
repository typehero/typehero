import { prisma } from '@repo/db';
import { ONE_MONTH } from '../increment-time';

export async function updateClick(slug: string): Promise<void> {
  await prisma.shortURL.update({
    where: {
      shortUrlSlug: slug,
    },
    data: {
      // increase the expiration date by one month on each click
      expiresAt: new Date(Date.now() + ONE_MONTH),
      clicks: {
        increment: 1,
      },
    },
  });
}

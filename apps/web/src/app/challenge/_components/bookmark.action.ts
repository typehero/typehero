'use server';
import { prisma } from '@repo/db';

export async function addOrRemoveBookmark(
  challengeId: number,
  userId: string,
  shouldBookmark: boolean,
) {
  const bookmarkExists = await prisma.bookmark.findFirst({
    where: {
      challengeId,
      userId,
    },
  });
  if (!bookmarkExists && shouldBookmark) {
    await prisma.bookmark.create({
      data: {
        challengeId,
        userId,
      },
    });
  }
  if (bookmarkExists && !shouldBookmark) {
    await prisma.bookmark.delete({
      where: {
        id: bookmarkExists.id,
      },
    });
  }
}

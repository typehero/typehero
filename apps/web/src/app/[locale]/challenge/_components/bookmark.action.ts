'use server';

import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';

export const createCacheKeyForBookmarksTab = (userId: string) => `${userId}-bookmarked-challenges`;

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

  revalidateTag(createCacheKeyForBookmarksTab(userId));
}

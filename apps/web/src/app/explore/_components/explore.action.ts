'use server';

import { prisma } from '@repo/db';
import { Tags, type Difficulty } from '@repo/db/types';

export type ExploreChallengeData = ReturnType<typeof getChallengesByTagOrDifficulty>;
const allTags: Tags[] = Object.values(Tags);

/**
 * Fetches challenges either by tag or difficulty.
 */
export async function getChallengesByTagOrDifficulty(str: string, take?: number) {
  const formattedStr = str.trim().toUpperCase();

  return prisma.challenge.findMany({
    where: {
      status: 'ACTIVE',
      user: {
        NOT: {
          status: 'BANNED',
        },
      },
      // OR didn't work. so this workaround is fine because IT WORKS :3
      ...(allTags.includes(formattedStr as keyof typeof Tags)
        ? {
            tags: { every: { tag: formattedStr as Tags } },
          }
        : {
            difficulty: { in: [formattedStr as Difficulty] },
          }),
    },
    include: {
      _count: {
        select: { vote: true, comment: true },
      },
      user: true,
    },
    ...(take && {
      take,
    }),
  });
}

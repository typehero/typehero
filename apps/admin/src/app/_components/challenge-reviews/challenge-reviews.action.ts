'use server';

import { prisma } from '@repo/db';

export type ChallengeReviewData = Awaited<ReturnType<typeof getPendingChallenges>>;
export async function getPendingChallenges() {
  return prisma.challenge.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
}

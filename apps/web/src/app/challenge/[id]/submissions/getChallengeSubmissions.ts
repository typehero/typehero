import { cache } from 'react';
import { prisma } from '@typehero/database';

export type ChallengeSubmissions = NonNullable<Awaited<ReturnType<typeof getChallengeSubmissions>>>;
export const getChallengeSubmissions = cache(async (userId: string, challengeId: string) => {
  const solutions = await prisma.submission.findMany({
    where: { challengeId: +challengeId, userId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });

  return solutions;
});

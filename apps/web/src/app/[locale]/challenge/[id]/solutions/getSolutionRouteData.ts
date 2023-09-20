import { cache } from 'react';
import { prisma } from '@repo/db';
import type { Session } from '@repo/auth/server';

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolutionsRouteData>>>;
export const getSolutionsRouteData = cache(async (challengeId: string, session: Session | null) => {
  const data = await prisma.challenge.findFirst({
    where: { id: Number(challengeId) },
    select: {
      id: true,
      // we just want their most recent solution
      submission: {
        where: {
          userId: session?.user.id || '',
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        take: 1,
      },
      sharedSolution: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: { vote: true, solutionComment: true },
          },
        },
      },
    },
  });

  return data;
});

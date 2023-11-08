import { cache } from 'react';
import { prisma } from '@repo/db';
import type { Session } from '@repo/auth/server';

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolutionsRouteData>>>;
export const getSolutionsRouteData = cache(async (slug: string, session: Session | null) => {
  const data = await prisma.challenge.findFirst({
    where: { slug },
    select: {
      id: true,
      submission: {
        where: {
          userId: session?.user.id || '',
          isSuccessful: true,
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
            isPinned: 'desc',
          },
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

'use server';
import { cache } from 'react';
import { prisma } from '@repo/db';
import { type Session } from '@repo/auth/server';
import type { SortKey, SortOrder } from '~/utils/sorting';
import { orderBy } from '~/utils/sorting';

const PAGESIZE = 10;

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

export async function getPaginatedSolutions({
  slug,
  page,
  sortKey = 'createdAt',
  sortOrder = 'desc',
}: {
  slug: string;
  page: number;
  sortKey?: SortKey;
  sortOrder?: SortOrder;
}) {
  const challenge = await prisma.challenge.findFirst({
    where: { slug },
  });

  const solutions = await prisma.sharedSolution.findMany({
    where: { challengeId: challenge?.id },
    skip: (page - 1) * PAGESIZE,
    take: PAGESIZE,
    orderBy: [
      {
        isPinned: 'desc' as SortOrder,
      },
      orderBy(sortKey, sortOrder),
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
  });

  const totalSolutions = await prisma.sharedSolution.count({
    where: { challengeId: challenge?.id },
  });

  const totalPages = Math.ceil(totalSolutions / PAGESIZE);

  return {
    totalPages,
    hasMore: page < totalPages,
    solutions,
  };
}

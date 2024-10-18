'use server';
import { prisma } from '@repo/db';
import { auth } from '~/server/auth';
import type { SortKey, SortOrder } from '~/utils/sorting';
import { orderBy } from '~/utils/sorting';

const PAGESIZE = 10;

export type PaginatedSolution = NonNullable<Awaited<ReturnType<typeof getPaginatedSolutions>>>;
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
  const session = await auth();
  const data = await prisma.challenge.findFirst({
    where: { slug },
    select: {
      _count: {
        select: {
          sharedSolution: true,
        },
      },
      id: true,
      submission: {
        where: {
          userId: session?.user?.id || '',
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
              roles: true,
              image: true,
              bio: true,
            },
          },
          _count: {
            select: { vote: true, solutionComment: true },
          },
        },
      },
    },
  });

  const totalSolutions = data?._count?.sharedSolution || 0;

  const totalPages = Math.ceil(totalSolutions / PAGESIZE);

  return {
    ...data,
    totalPages,
    hasMore: page < totalPages,
  };
}

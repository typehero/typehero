'use server';

import { prisma } from '@repo/db';
import { cache } from 'react';

export type ReportsData = Awaited<ReturnType<typeof getReports>>;
export type InfiniteReports = Awaited<ReturnType<typeof getInfiniteReports>>;

export const getReportedUserInformation = cache(async (userId: string) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      comment: {
        take: 10,
        include: {
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
          rootChallenge: true,
          rootSolution: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      sharedSolution: {
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      },
      challenge: {
        take: 5,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
});

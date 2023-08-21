'use server';

import { prisma } from '@repo/db';

export type ReportsData = Awaited<ReturnType<typeof getReports>>;
export type InfiniteReports = Awaited<ReturnType<typeof getInfiniteReports>>;

export async function getInfiniteReports(lastCursor?: number) {
  const reports = await getReports(lastCursor);
  const nextCursor = reports.at(-1)?.id;

  let hasNextCursor = false;
  if (nextCursor) {
    const nextPage = await getReports(nextCursor);
    if (nextPage.length > 0) hasNextCursor = true;
  }

  return {
    data: reports,
    metadata: {
      hasNextPage: hasNextCursor,
      lastCursor: hasNextCursor ? nextCursor : null,
    },
  };
}

export async function getReports(lastCursor?: number, take = 3) {
  return prisma.report.findMany({
    include: {
      challenge: {
        include: {
          _count: {
            select: {
              vote: true,
            },
          },
        },
      },
      user: true,
      reporter: true,
      issues: true,
      comment: true,
      solution: true,
    },
    take,
    ...(lastCursor && {
      skip: 1,
      cursor: {
        id: lastCursor,
      },
    }),
    orderBy: [
      {
        status: 'asc',
      },
    ],
  });
}

export async function getReportedUserInformation(userId: string) {
  return await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      comment: {
        take: 10,
        include: {
          user: true,
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
}

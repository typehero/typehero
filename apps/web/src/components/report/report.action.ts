'use server';

import { type Prisma, type Report } from '@repo/db/types';
import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';

export interface ReportBase {
  issues: Prisma.ReportIssueCreateWithoutReportInput[];
}

export type ChallengeReport = Omit<
  Report,
  | 'commentId'
  | 'createdAt'
  | 'id'
  | 'reporterId'
  | 'solutionId'
  | 'status'
  | 'type'
  | 'updatedAt'
  | 'userId'
> &
  ReportBase & { type: 'CHALLENGE' };

export type UserReport = Omit<
  Report,
  | 'challengeId'
  | 'commentId'
  | 'createdAt'
  | 'id'
  | 'reporterId'
  | 'solutionId'
  | 'status'
  | 'type'
  | 'updatedAt'
> &
  ReportBase & { type: 'USER' };

export type CommentReport = Omit<
  Report,
  | 'challengeId'
  | 'createdAt'
  | 'id'
  | 'reporterId'
  | 'solutionId'
  | 'status'
  | 'type'
  | 'updatedAt'
  | 'userId'
> &
  ReportBase & { type: 'COMMENT' };

export type SolutionReport = Omit<
  Report,
  | 'challengeId'
  | 'commentId'
  | 'createdAt'
  | 'id'
  | 'reporterId'
  | 'status'
  | 'type'
  | 'updatedAt'
  | 'userId'
> &
  ReportBase & { type: 'SOLUTION' };

/**
 * @param report a report object specific to a user, challenge, or comment report type
 * @returns 'created' if successful, 'not_logged_in' if the user is not logged in, and 'already_exists' if there's a pending report of the same type by the same user.
 */
export async function addReport(
  report: ChallengeReport | CommentReport | SolutionReport | UserReport,
) {
  const reporter = await getServerAuthSession();
  if (!reporter?.user.id) return 'not_logged_in';

  let filterData;
  switch (report.type) {
    case 'CHALLENGE':
      filterData = {
        challengeId: report.challengeId,
      };
      break;
    case 'COMMENT':
      filterData = {
        commentId: report.commentId,
      };
      break;
    case 'USER':
      filterData = {
        userId: report.userId,
      };
      break;
    case 'SOLUTION':
      filterData = {
        solutionId: report.solutionId,
      };
      break;
  }

  const alreadyReported = await prisma.report.findFirst({
    where: {
      type: report.type,
      status: 'PENDING',
      reporterId: reporter.user.id,
      ...filterData,
    },
  });

  if (alreadyReported) return 'already_exists';

  await prisma.report.create({
    data: {
      reporterId: reporter.user.id,
      updatedAt: new Date(),
      ...report,
      issues: {
        createMany: {
          data: report.issues,
        },
      },
      status: 'PENDING',
    },
  });

  return 'created';
}

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

'use server';

import { prisma } from '~/server/db';
import type { FormValues } from '../challenge/description';
import { type Report, type Prisma } from '@prisma/client';
import { getServerAuthSession } from '~/server/auth';

export type ReportBase = {
  issues: Prisma.ReportIssueCreateWithoutReportInput[];
};

export type ChallengeReport = Omit<
  Report,
  | 'id'
  | 'type'
  | 'userId'
  | 'commentId'
  | 'reporterId'
  | 'status'
  | 'solutionId'
  | 'updatedAt'
  | 'createdAt'
> & { type: 'CHALLENGE' } & ReportBase;

export type UserReport = Omit<
  Report,
  | 'id'
  | 'type'
  | 'challengeId'
  | 'commentId'
  | 'reporterId'
  | 'status'
  | 'solutionId'
  | 'updatedAt'
  | 'createdAt'
> & { type: 'USER' } & ReportBase;

export type CommentReport = Omit<
  Report,
  | 'id'
  | 'type'
  | 'challengeId'
  | 'userId'
  | 'reporterId'
  | 'status'
  | 'solutionId'
  | 'updatedAt'
  | 'createdAt'
> & { type: 'COMMENT' } & ReportBase;

export type SolutionReport = Omit<
  Report,
  | 'id'
  | 'type'
  | 'challengeId'
  | 'userId'
  | 'reporterId'
  | 'status'
  | 'commentId'
  | 'updatedAt'
  | 'createdAt'
> & { type: 'SOLUTION' } & ReportBase;

/**
 * @param report a report object specific to a user, challenge, or comment report type
 * @returns 'created' if successful, 'not_logged_in' if the user is not logged in, and 'already_exists' if there's a pending report of the same type by the same user.
 */
export async function addReport(
  report: ChallengeReport | UserReport | CommentReport | SolutionReport,
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

export async function getReports(lastCursor?: number, take = 25) {
  return prisma.report.findMany({
    include: {
      challenge: {
        include: {
          _count: {
            select: {
              vote: true,
            }
          }
        }
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

export async function addChallengeReport(challengeId: number, userId: string, data: FormValues) {
  if (userId === undefined) return 'not_logged_in';

  const report = await prisma.challengeReport.findMany({
    where: {
      challengeId,
      authorId: userId,
    },
  });
  if (report.length > 0) {
    return 'report_already_made';
  }

  await prisma.challengeReport.create({
    data: {
      challengeId,
      authorId: userId,
      text: data.comments,
      unclear: data.examples,
      derogatory: data.derogatory,
    },
  });

  return 'created';
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

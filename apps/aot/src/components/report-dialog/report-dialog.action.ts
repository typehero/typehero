'use server';

import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { type Prisma, type Report } from '@repo/db/types';

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
  const reporter = await auth();
  if (!reporter?.user?.id) return 'not_logged_in';

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

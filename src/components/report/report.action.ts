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
  'id' | 'type' | 'userId' | 'commentId' | 'reporterId' | 'status' | 'solutionId'
> & { type: 'CHALLENGE' } & ReportBase;

export type UserReport = Omit<
  Report,
  'id' | 'type' | 'challengeId' | 'commentId' | 'reporterId' | 'status' | 'solutionId'
> & { type: 'USER' } & ReportBase;

export type CommentReport = Omit<
  Report,
  'id' | 'type' | 'challengeId' | 'userId' | 'reporterId' | 'status' | 'solutionId'
> & { type: 'COMMENT' } & ReportBase;

export type SolutionReport = Omit<
  Report,
  'id' | 'type' | 'challengeId' | 'userId' | 'reporterId' | 'status' | 'commentId'
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
  console.info('HAAAAAAAA', report.type, reporter.user.id, filterData);
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

export async function addChallengeReport(challengeId: number, userId: string, data: FormValues) {
  if (userId === undefined) return 'not_logged_in';

  const report = await prisma.challengeReport.findMany({
    where: {
      challengeId,
      authorId: userId,
    },
  });
  if (report.length > 0) {
    console.info(report);
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

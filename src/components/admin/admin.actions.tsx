'use server';

import { type Report, type Prisma } from '@prisma/client';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';

export type AdminReportDetails = Awaited<ReturnType<typeof getChallengeReports>>;

// FML this was obnoxious to do
export type ChallengeInfo = { type: 'CHALLENGE' } & Omit<
  Report,
  'id' | 'userId' | 'type' | 'status'
>;
export type UserInfo = { type: 'USER' } & Omit<Report, 'id' | 'challengeId' | 'type' | 'status'>;

/**
 *
 * @param info the info needed to create the Report instance
 * @param issues any issues types that are connected to this.
 * @returns the newly created report information.
 */
export async function addReport(
  info: ChallengeInfo | UserInfo,
  issues: Prisma.ReportIssueCreateManyReportInput[] = [{ type: 'OTHER' }],
) {
  return prisma.report.create({
    data: {
      status: 'PENDING',
      ...info,
      issues: {
        createMany: {
          data: issues,
        },
      },
    },
  });
}

/**
 * The function fetches all the reports along
 * with challenge and the user.
 */
export async function getChallengeReports() {
  return prisma.challengeReport.findMany({
    include: {
      challenge: {
        include: {
          user: true,
        },
      },
      author: true,
      moderator: true,
    },
  });
}

export type AdminBannedUsers = Awaited<ReturnType<typeof getBannedUsers>>;

/**
 * The function fetches all the banned
 * user's.
 */
export async function getBannedUsers() {
  return prisma.user.findMany({
    where: {
      status: 'BANNED',
    },
  });
}

/**
 * The function deletes a challenge & updates
 * the report to indicate the status of `CLEARED`.
 * @param challengeId The id of the challenge.
 * @param reportId The id of the report.
 * @returns
 */
export async function disableChallenge(challengeId: number, reportId: number) {
  const session = await getServerAuthSession();
  await prisma.$transaction([
    prisma.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        visibility: 'HIDDEN',
      },
    }),
    prisma.challengeReport.update({
      where: {
        id: reportId,
      },
      data: {
        status: 'CLEARED',
        moderatorId: session?.user.id,
      },
    }),
  ]);
}

/**
 * The function updates the report to indicate
 * a status of `DISMISSED`.
 * @param reportId The id of the report.
 * @returns
 */
export async function dismissChallengeReport(reportId: number) {
  const session = await getServerAuthSession();
  return prisma.challengeReport.update({
    where: {
      id: reportId,
    },
    data: {
      status: 'DISMISSED',
      moderatorId: session?.user.id,
    },
  });
}

/**
 * The function updates the user to indicate a status
 * of `BANNED`.
 * @param userId The id of the user.
 * @param reportId The id of the report.
 * @returns
 */
export async function banUser(userId: string, reportId: number, banReason?: string) {
  const session = await getServerAuthSession();

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'BANNED',
        banReason: banReason,
      },
    }),
    prisma.challenge.updateMany({
      where: {
        userId: userId,
      },
      data: {
        visibility: 'HIDDEN',
      },
    }),
    prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    }),
    prisma.challengeReport.update({
      where: {
        id: reportId,
      },
      data: {
        status: 'CLEARED',
        moderatorId: session?.user.id,
      },
    }),
  ]);
}
/**
 * The function lifts the ban off the user i.e. updates
 * the status to `ACTIVE`.
 * @param userId The id of the user.
 * @returns
 */
export async function unbanUser(userId: string) {
  return prisma.$transaction([
    prisma.challenge.updateMany({
      where: {
        userId: userId,
      },
      data: {
        visibility: 'VISIBLE',
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'ACTIVE',
      },
    }),
  ]);
}

export async function getChallenge(id: number) {
  return prisma.challengeReport.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      author: true,
      moderator: {
        select: {
          name: true,
        },
      },
      challenge: {
        include: {
          user: true,
          vote: true,
        },
      },
    },
  });
}

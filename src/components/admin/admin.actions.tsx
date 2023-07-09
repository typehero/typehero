'use server';

import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';

export type AdminReportDetails = Awaited<ReturnType<typeof getChallengeReports>>;

/**
 * The function fetches all the reports along
 * with challenge and the user.
 */
export function getChallengeReports() {
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
  try {
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
  } catch (e) {
    console.log(e);
    return 'uh_oh';
  }
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

  try {
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
  } catch (e) {
    console.log(e);
    return 'uh_oh';
  }
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

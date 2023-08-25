'use server';

import { type Report, type Prisma } from '@repo/db/types';
import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';

// FML this was obnoxious to do
export type ChallengeInfo = Omit<Report, 'id' | 'status' | 'type' | 'userId'> & {
  type: 'CHALLENGE';
};
export type UserInfo = Omit<Report, 'challengeId' | 'id' | 'status' | 'type'> & { type: 'USER' };

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

export type BannedUsers = Awaited<ReturnType<typeof getBannedUsers>>;

export async function deleteComment(commentId: number, reportId: number) {
  return prisma.$transaction([
    prisma.comment.delete({
      where: {
        id: commentId,
      },
    }),
    prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: 'CLEARED',
        updatedAt: new Date(),
      },
    }),
  ]);
}

/**
 * The function fetches all the banned
 * user's.
 */
export type GetBannedUsers = NonNullable<Awaited<ReturnType<typeof getBannedUsers>>>;
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
export async function banChallenge(challengeId: number, reportId: number) {
  const session = await getServerAuthSession();
  await prisma.$transaction([
    prisma.challenge.update({
      where: {
        id: challengeId,
      },
      data: {
        status: 'BANNED',
      },
    }),
    prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: 'CLEARED',
        moderatorId: session?.user.id,
        updatedAt: new Date(),
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
export async function dismissReport(reportId: number) {
  const session = await getServerAuthSession();
  return prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      status: 'DISMISSED',
      moderatorId: session?.user.id,
      updatedAt: new Date(),
    },
  });
}

export async function deleteSolution(solutionId: number, reportId: number) {
  try {
    await prisma.$transaction([
      prisma.sharedSolution.delete({
        where: {
          id: solutionId,
        },
      }),
      prisma.report.update({
        where: {
          id: reportId,
        },
        data: {
          status: 'CLEARED',
          updatedAt: new Date(),
        },
      }),
    ]);
    return 'ok';
  } catch (e) {
    return 'failed';
  }
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
        banReason,
      },
    }),
    prisma.challenge.updateMany({
      where: {
        userId,
      },
      data: {
        status: 'BANNED',
      },
    }),
    prisma.session.deleteMany({
      where: {
        userId,
      },
    }),
    prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: 'CLEARED',
        moderatorId: session?.user.id,
        updatedAt: new Date(),
      },
    }),
    prisma.comment.updateMany({
      where: {
        userId,
      },
      data: {
        visible: false,
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
        userId,
      },
      data: {
        status: 'ACTIVE',
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
  return prisma.challenge.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          vote: true,
          bookmark: true,
          comment: true,
        },
      },
    },
  });
}

export type UploadedImages = Awaited<ReturnType<typeof getUploadedImages>>;
/**
 * The function fetches the last 100 uploaded images.
 */
export async function getUploadedImages() {
  return prisma.imageUpload.findMany({
    take: 100,
    orderBy: {
      createdAt: 'asc',
    },
  });
}

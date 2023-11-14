'use server';
import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { type Prisma, type Report } from '@repo/db/types';
import { cache } from 'react';
import { assertAdmin } from '~/utils/auth-guards';

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
  const session = await auth();
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
  const session = await auth();
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
  const session = await auth();

  assertAdmin(session);

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

export const getChallenge = cache(async (id: number) => {
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
      user: {
        select: {
          name: true,
        },
      },
    },
  });
});

export const getReportedUserInformation = async (userId: string) => {
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
};

export type ReportWithInfo = Awaited<ReturnType<typeof getReport>>;

export async function getReport(id: number) {
  return prisma.report.findFirstOrThrow({
    where: {
      id: Number(id),
    },
    orderBy: {
      type: 'asc',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      challenge: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      comment: {
        include: {
          _count: {
            select: {
              replies: true,
            },
          },
          rootChallenge: true,
          rootSolution: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      issues: true,
      reporter: {
        select: {
          name: true,
        },
      },
      solution: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      moderator: {
        select: {
          name: true,
        },
      },
    },
  });
}

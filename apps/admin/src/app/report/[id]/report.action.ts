import { prisma } from '@repo/db';

export async function getReports() {
  const challengeReports = await prisma.report.findMany({
    where: {
      type: 'CHALLENGE',
    },
    include: {
      challenge: {
        include: {
          user: true,
        },
      },
    },
  });
  const otherReports = await prisma.report.findMany({
    where: {
      type: { not: 'CHALLENGE' },
    },
  });
  return {
    challengeReports,
    otherReports,
  };
}

export type ReportWithInfo = Awaited<ReturnType<typeof getReport>>;

export async function getReport(idNum: number) {
  return prisma.report.findFirst({
    where: {
      id: Number(idNum),
    },
    orderBy: {
      type: 'asc',
    },
    include: {
      challenge: {
        include: {
          user: true,
        },
      },
      comment: {
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
      },
      issues: true,
      reporter: true,
      solution: {
        include: {
          user: true,
        },
      },
      user: true,
      moderator: true,
    },
  });
}

export async function getReportedUserInformation(userId: string) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      comment: {
        take: 10,
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

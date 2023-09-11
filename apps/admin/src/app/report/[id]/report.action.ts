import { prisma } from '@repo/db';

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

export async function getReportedUserInformation(userId: string) {
  return await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
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

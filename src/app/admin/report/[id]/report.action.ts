import { prisma } from '~/server/db';
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
      type: {not: 'CHALLENGE'},
    }
  });
  return {
    challengeReports,
    otherReports,
  };
}

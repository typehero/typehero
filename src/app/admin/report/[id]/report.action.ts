import { prisma } from '~/server/db';
export async function getReports() {
  const challengeReports = await prisma.challengeReport.findMany({
    include: {
      challenge: {
        include: {
          user: true,
        },
      },
      author: true,
    },
  });
  const otherReports = await prisma.commentReport.findMany();
  return {
    challengeReports,
    otherReports,
  };
}

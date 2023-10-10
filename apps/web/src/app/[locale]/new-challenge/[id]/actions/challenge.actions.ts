import { prisma } from '@repo/db';
export function getChallengeInfo(challengeId: number) {
  return prisma.challenge.findFirstOrThrow({
    include: {
      user: {
        select: {
          name: true,
        }
      },
      _count: {
        select: {
          vote: true,
        },
      },
      vote: {
        where: {
          userId: '',
        }
      },
      bookmark: {
        where: {
          userId: '',
        }
      }
    },
    where: {
      id: challengeId,
    },
  });
}
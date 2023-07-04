'use server';
import { prisma } from '~/server/db';

export async function saveSubmission(challengeId: number, userId: string, code: string) {
  await prisma.solution.upsert({
    where: {
      challengeId_userId: {
        challengeId,
        userId,
      },
    },
    update: {
      code,
    },
    create: {
      challengeId,
      userId,
      code,
    },
  });
}

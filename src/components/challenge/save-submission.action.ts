'use server';
import { prisma } from '~/server/db';

export async function saveSubmission(
  challengeId: number,
  userId: string,
  code: string,
  isSuccessful: boolean,
) {
  await prisma.solution.create({
    data: {
      challengeId,
      userId,
      code,
      isSuccessful,
    },
  });
}

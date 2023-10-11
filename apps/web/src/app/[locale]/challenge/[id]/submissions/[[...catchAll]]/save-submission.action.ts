'use server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';

export async function saveSubmission(
  challengeId: number,
  userId: string,
  code: string,
  isSuccessful: boolean,
) {
  await prisma.submission.create({
    data: {
      challengeId,
      userId,
      code,
      isSuccessful,
    },
  });
  revalidateTag(`${challengeId}-challenge-submissions`);
  revalidateTag(`challenge-${challengeId}-solutions`);
}

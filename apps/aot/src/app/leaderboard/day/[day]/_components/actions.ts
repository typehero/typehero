'use server';

import { prisma } from '@repo/db';

export async function saveSubmission({
  challengeId,
  userId,
}: {
  challengeId: number;
  userId: string;
}) {
  const submission = await prisma.submission.create({
    data: {
      challengeId,
      userId,
      code: '',
      isSuccessful: true,
    },
  });
}

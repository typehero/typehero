'use server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const submissionSchema = z.object({
  challengeId: z.number(),
  code: z.string(),
  isSuccessful: z.boolean(),
});

export async function saveSubmission(challengeId: number, code: string, isSuccessful: boolean) {
  submissionSchema.parse({ challengeId, code, isSuccessful });

  const session = await getServerAuthSession();
  if (!session) {
    throw new Error('User not authenticated');
  }

  await prisma.submission.create({
    data: {
      challengeId,
      userId: session.user.id,
      code,
      isSuccessful,
    },
  });
  revalidateTag(`${challengeId}-challenge-submissions`);
  revalidateTag(`challenge-${challengeId}-solutions`);
}

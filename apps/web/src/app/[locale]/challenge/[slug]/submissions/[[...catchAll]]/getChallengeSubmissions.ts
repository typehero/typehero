'use server';

import { cache } from 'react';
import { prisma } from '@repo/db';
import { auth } from '@repo/auth/server';

export const getChallengeSubmissionById = cache(async (id: string) => {
  const session = await auth();
  return prisma.submission.findFirstOrThrow({
    where: {
      id: Number(id),
      userId: session?.user?.id || '',
    },
    include: {
      challenge: {
        select: {
          name: true,
        },
      },
    },
  });
});

'use server';

import { prisma } from '@repo/db';
import { cache } from 'react';

export const getChallengeSubmissionById = cache(async (submissionId: string, userId: string) => {
  return prisma.submission.findFirst({
    where: {
      id: Number(submissionId),
      userId,
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

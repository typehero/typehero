'use server';

import { cache } from 'react';
import { prisma } from '@repo/db';

export const getChallengeSubmissionById = cache((submissionId: string, userId: string) => {
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

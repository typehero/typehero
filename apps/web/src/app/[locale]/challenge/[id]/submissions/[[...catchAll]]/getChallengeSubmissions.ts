'use server';

import { cache } from 'react';
import { prisma } from '@repo/db';

export const getChallengeSubmissionById = cache((id: string) => {
  return prisma.submission.findFirst({
    where: {
      id: Number(id),
    },
  });
});

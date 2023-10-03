'use server';

import { cache } from 'react';
import { prisma } from '@repo/db';

export type ChallengeSubmissions = NonNullable<Awaited<ReturnType<typeof getChallengeSubmissions>>>;
export const getChallengeSubmissions = cache((userId: string, challengeId: string) => {
  return prisma.submission.findMany({
    where: { challengeId: Number(challengeId), userId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
});

export const getChallengeSubmissionById = cache((id: string) => {
  return prisma.submission.findFirst({
    where: {
      id: Number(id),
    },
  });
});

'use server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import type { ChallengeRouteData } from '../../getChallengeRouteData';
import { createCacheKeyForSolutions } from '../../solutions/_components/_actions';

export const createChallengeSubmissionCacheKey = (slug: string) => {
  return `${slug}-challenge-submissions`;
};
interface Args {
  challenge: ChallengeRouteData['challenge'];
  userId: string;
  code: string;
  isSuccessful: boolean;
}
export async function saveSubmission({ challenge, userId, code, isSuccessful }: Args) {
  await prisma.submission.create({
    data: {
      challengeId: challenge.id,
      userId,
      code,
      isSuccessful,
    },
  });
  revalidateTag(createChallengeSubmissionCacheKey(challenge.slug));
  revalidateTag(createCacheKeyForSolutions(challenge.slug));
}

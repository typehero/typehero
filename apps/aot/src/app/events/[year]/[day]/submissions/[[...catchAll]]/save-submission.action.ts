'use server';
import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import type { ChallengeRouteData } from '../../getChallengeRouteData';
import {
  createChallengeSubmissionCacheKey,
  createCompletedSubmissionCacheKey,
  createInProgressSubmissionCacheKey,
} from './cache-keys';
import { createCacheKeyForSolutions } from '../../solutions/_components/_actions';

interface Args {
  challenge: ChallengeRouteData['challenge'];
  code: string;
  isSuccessful: boolean;
}
export async function saveSubmission({ challenge, code, isSuccessful }: Args) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Not Authorized');
  }
  const userId = session.user.id;

  const submission = await prisma.submission.create({
    data: {
      challengeId: challenge.id,
      userId,
      code,
      isSuccessful,
    },
  });
  // @TODO: we should be able to just invalidate by the challenge slug
  revalidateTag(createChallengeSubmissionCacheKey(challenge.slug));
  revalidateTag(createCacheKeyForSolutions(challenge.slug));
  revalidateTag(createInProgressSubmissionCacheKey(userId));
  revalidateTag(createCompletedSubmissionCacheKey(userId));
  return submission;
}

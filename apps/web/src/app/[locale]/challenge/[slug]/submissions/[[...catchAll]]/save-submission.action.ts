'use server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import type { ChallengeRouteData } from '../../getChallengeRouteData';
import { createCacheKeyForSolutions } from '../../solutions/_components/_actions';
import {
  createChallengeSubmissionCacheKey,
  createCompletedSubmissionCacheKey,
  createInProgressSubmissionCacheKey,
} from './cache-keys';
import { auth } from '@repo/auth/server';
import { AOT_CHALLENGES } from '../../aot-slugs';
import { getAllFlags } from '~/utils/feature-flags';
import { daysAfterDecemberFirst } from '~/utils/aot';

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

  const featureFlags = await getAllFlags();
  const isAotChallenge = AOT_CHALLENGES.includes(challenge.slug);

  if (featureFlags.enableHolidayEvent && isAotChallenge) {
    const [, day = '1'] = challenge.slug.split('-');
    const daysPassed = daysAfterDecemberFirst();
    if (parseInt(day) > daysPassed + 1) {
      throw new Error('Not Available');
    }
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
  revalidateTag(createChallengeSubmissionCacheKey(challenge.slug));
  revalidateTag(createCacheKeyForSolutions(challenge.slug));
  revalidateTag(createInProgressSubmissionCacheKey(userId));
  revalidateTag(createCompletedSubmissionCacheKey(userId));
  return submission;
}

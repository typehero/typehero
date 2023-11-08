import { prisma } from '@repo/db';
import { createInProgressSubmissionCacheKey } from '~/app/challenge/[slug]/submissions/[[...catchAll]]/save-submission.action';
import { withUnstableCache } from '~/utils/withUnstableCache';
import ChallengeHistory from './challenge-history';

export async function InProgressTab({ userId }: { userId: string }) {
  const challenges = await withUnstableCache({
    fn: getInProgressChallenges,
    args: [userId],
    keys: [`in-progress-challenges`],
    tags: [createInProgressSubmissionCacheKey(userId)],
  });

  return <ChallengeHistory challenges={challenges} />;
}

async function getInProgressChallenges(userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: {
      AND: [
        {
          submission: {
            none: {
              userId,
              isSuccessful: true,
            },
          },
        },
        // Make sure there is at least one submission
        { submission: { some: { userId, isSuccessful: false } } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      submission: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          createdAt: true,
        },
      },
    },
  });

  return challenges.sort(
    (challengeA, challengeB) =>
      new Date(challengeB.submission[0]!.createdAt).getTime() -
      new Date(challengeA.submission[0]!.createdAt).getTime(),
  );
}

import { prisma } from '@repo/db';
import { createCompletedSubmissionCacheKey } from '~/app/[locale]/challenge/[slug]/submissions/[[...catchAll]]/save-submission.action';
import { withUnstableCache } from '~/utils/withUnstableCache';
import ChallengeHistory from './challenge-history';

export async function CompletedTab({ userId }: { userId: string }) {
  const challenges = await withUnstableCache({
    fn: getCompletedChallenges,
    args: [userId],
    keys: [`completed-challenges`],
    tags: [createCompletedSubmissionCacheKey(userId)],
  });

  return <ChallengeHistory challenges={challenges} />;
}

async function getCompletedChallenges(userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: {
      submission: {
        some: {
          userId,
          isSuccessful: true,
        },
      },
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

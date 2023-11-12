import { createCompletedSubmissionCacheKey } from '~/app/[locale]/challenge/[slug]/submissions/[[...catchAll]]/cache-keys';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { getChallengeHistoryByCategory } from './_actions';
import ChallengeHistory from './challenge-history';

export async function CompletedTab({ userId }: { userId: string }) {
  const challenges = await withUnstableCache({
    fn: getChallengeHistoryByCategory,
    args: ['completed', userId],
    keys: [`completed-challenges-${userId}`],
    tags: [createCompletedSubmissionCacheKey(userId)],
  });

  console.log({ challenges });

  return <ChallengeHistory challenges={challenges} />;
}

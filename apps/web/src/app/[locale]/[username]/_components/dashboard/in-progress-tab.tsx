import { createInProgressSubmissionCacheKey } from '~/app/[locale]/challenge/[slug]/submissions/[[...catchAll]]/cache-keys';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { getChallengeHistoryByCategory } from './_actions';
import ChallengeHistory from './challenge-history';

export async function InProgressTab({ userId }: { userId: string }) {
  const challenges = await withUnstableCache({
    fn: getChallengeHistoryByCategory,
    args: ['in-progress', userId],
    keys: [`in-progress-challenges-${userId}`],
    tags: [createInProgressSubmissionCacheKey(userId)],
  });

  return <ChallengeHistory challenges={challenges} />;
}

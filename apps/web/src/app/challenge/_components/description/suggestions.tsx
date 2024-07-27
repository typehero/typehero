import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { TrackChallenge } from '~/app/tracks/_components/track-challenge-card';
import { getSimilarChallenges } from '~/utils/server/get-similar-challenges';
import { SuggestionsSkeleton } from './suggestions-skeleton';

export function Suggestions({ challengeId }: { challengeId: number }) {
  const { data: similarChallenges, status } = useQuery({
    queryKey: ['similar-challenges', challengeId],
    queryFn: () => {
      return getSimilarChallenges(challengeId, 3);
    },
  });

  if (status === 'error') {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-lg font-semibold md:text-xl">More Challenges</h3>
      </div>
      {status === 'pending' ? (
        <SuggestionsSkeleton />
      ) : (
        <div>
          {similarChallenges?.map((challenge, idx) => {
            return (
              <Link href={`/challenge/${challenge.slug}`} key={idx}>
                <TrackChallenge
                  className="to-neutral-500/10 px-3 py-2 dark:from-neutral-700/70 dark:to-neutral-700/70"
                  challenge={{ ...challenge, submission: [] }}
                  hideSubmissionStatus
                  isCompleted={false}
                  isCompact
                  isInProgress={false}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

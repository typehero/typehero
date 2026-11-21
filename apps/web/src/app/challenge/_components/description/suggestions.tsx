import { useSession } from '@repo/auth/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { TrackChallenge } from '~/app/tracks/_components/track-challenge-card';
import { useTRPCClient } from '~/trpc/react';
import { SuggestionsSkeleton } from './suggestions-skeleton';

export function Suggestions({ challengeId }: { challengeId: number }) {
  const trpcClient = useTRPCClient();
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id ?? null;
  const { data: similarChallenges, status } = useQuery({
    queryKey: ['similar-challenges', challengeId, 3, userId],
    queryFn: () => trpcClient.challenge.similar.query({ challengeId, maxChallenges: 3 }),
    enabled: sessionStatus !== 'loading',
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

import { SheetHeader, SheetTitle } from '@repo/ui/components/sheet';
import { ChevronRight } from '@repo/ui/icons';
import Link from 'next/link';
import { useMemo } from 'react';
import { type ChallengeType, getChallengesAndTitle } from '~/app/get-challenges-and-title';
import { useProblemExplorerContext } from '~/app/problem-explorer.hooks';
import { useLocalStorage } from '~/utils/useLocalStorage';
import { TrackChallenge } from '../../tracks/_components/track-challenge-card';
import { TrackProgress } from '../../tracks/_components/track-progress';
import { useAllChallengesContext } from '../[slug]/all-challenges.hook';
import { useChallengeRouteData } from '../[slug]/challenge-route-data.hook';
import { SelectDropdown } from './select-dropdown';

export function ExplorerPanel() {
  const [, setTrackNameStorage] = useLocalStorage('trackName', 'popular');
  const { getTrack, setTrack, title, setTitle, sortKey, setSortKey } = useProblemExplorerContext();
  const { allChallenges } = useAllChallengesContext();

  const handleValueChange = (value: string) => {
    const { title, challenges, key } = getChallengesAndTitle(value as ChallengeType, allChallenges);
    setTitle(title);
    setTrack(challenges);
    setTrackNameStorage(value);
    setSortKey(key);
  };

  const { currentChallenge } = useChallengeRouteData();

  const challenges = getTrack;
  const completedChallenges = useMemo(
    () =>
      challenges
        .filter((challenge) => {
          return (
            challenge.submission.length &&
            challenge.submission.some((submission) => submission.isSuccessful)
          );
        })
        .map((challenge) => challenge.id),
    [challenges],
  );

  const inProgressChallenges = useMemo(
    () =>
      challenges
        .filter((challenge) => {
          return (
            challenge.submission.length &&
            challenge.submission.every((submission) => !submission.isSuccessful)
          );
        })
        .map((challenge) => challenge.id),
    [challenges],
  );
  return (
    <>
      <SheetHeader>
        <SheetTitle>
          <Link
            href="/explore"
            className="flex max-w-full items-center justify-start gap-4 font-semibold text-foreground text-xl"
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              Explore all challenges
            </span>
            <ChevronRight className="mt-0.5 h-6 w-6 shrink-0" />
          </Link>
          <div className="mt-8 flex items-start justify-between gap-4 text-lg">
            <div>{title}</div>
            <div className="text-sm">
              <SelectDropdown sortKey={sortKey} handleValueChange={handleValueChange} />
            </div>
          </div>
        </SheetTitle>
      </SheetHeader>
      {sortKey.value !== 'popular' ? (
        <TrackProgress
          completedChallenges={completedChallenges.length}
          totalChallenges={challenges.length}
        />
      ) : null}
      <div className="flex flex-col">
        {challenges.map((challenge) => {
          return (
            <Link key={challenge.id} href={`/challenge/${challenge.slug}`}>
              <TrackChallenge
                challenge={challenge}
                isCompleted={completedChallenges.includes(challenge.id)}
                isInProgress={inProgressChallenges.includes(challenge.id)}
                isSelected={challenge.id === currentChallenge?.id}
                isCompact
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}

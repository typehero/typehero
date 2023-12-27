import { SheetHeader, SheetTitle } from '@repo/ui/components/sheet';
import { ChevronRight } from '@repo/ui/icons';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import type { AllChallenges } from '~/components/Navigation/explore-nav';
import { TrackChallenge } from '../../tracks/_components/track-challenge-card';
import { TrackProgress } from '../../tracks/_components/track-progress';
import { SelectDropdown } from './select-dropdown';

interface Props {
  allChallenges: AllChallenges;
}
export const SORT_KEYS = [
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Beginner',
    value: 'beginner',
  },
  {
    label: 'Easy',
    value: 'easy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Hard',
    value: 'hard',
  },
  {
    label: 'Extreme',
    value: 'extreme',
  },
] as const;

export function SheetContentCustom({ allChallenges }: Props) {
  const [filterChallenges, setFilterChallenges] = useState(allChallenges.popularChallenges);
  const [sortKey, setSortKey] = useState<(typeof SORT_KEYS)[number]>(SORT_KEYS[0]);
  const [title, setTitle] = useState('Recommended');

  const handleValueChange = (value: string) => {
    setSortKey(SORT_KEYS.find((sk) => sk.value === value) ?? SORT_KEYS[0]);
  };
  useEffect(() => {
    if (sortKey.value === 'popular') {
      setTitle('Recommended');
      setFilterChallenges(allChallenges.popularChallenges);
    }
    if (sortKey.value === 'beginner') {
      setTitle('Great for Beginners');
      setFilterChallenges(allChallenges.beginnerChallenges);
    }
    if (sortKey.value === 'easy') {
      setTitle('Great for Learners');
      setFilterChallenges(allChallenges.easyChallenges);
    }
    if (sortKey.value === 'medium') {
      setTitle('Great for Enthusiasts');
      setFilterChallenges(allChallenges.mediumChallenges);
    }

    if (sortKey.value === 'hard') {
      setTitle('Great for Experts');
      setFilterChallenges(allChallenges.hardChallenges);
    }
    if (sortKey.value === 'extreme') {
      setTitle('Great for Masters');
      setFilterChallenges(allChallenges.extremeChallenges);
    }
  }, [allChallenges, sortKey.value]);

  const challenges = filterChallenges;
  const completedChallenges = challenges
    .filter((challenge) => {
      return (
        challenge.submission.length &&
        challenge.submission.some((submission) => submission.isSuccessful)
      );
    })
    .map((challenge) => challenge.id);

  const inProgressChallenges = challenges
    .filter((challenge) => {
      return (
        challenge.submission.length &&
        challenge.submission.every((submission) => !submission.isSuccessful)
      );
    })
    .map((challenge) => challenge.id);
  return (
    <>
      <SheetHeader>
        <SheetTitle>
          <Link
            href="/explore"
            className="text-foreground flex max-w-full items-center justify-start gap-4 text-xl font-semibold"
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
                // isSelected={challenge.id === challengeId}
                isCompact
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}

import { SheetHeader, SheetTitle } from '@repo/ui/components/sheet';
import Link from 'next/link';
import { ChevronRight } from '@repo/ui/icons';
import { TrackChallenge } from '../../tracks/_components/track-challenge-card';
import { TrackProgress } from '../../tracks/_components/track-progress';
import { SelectDropdown } from './select-dropdown';
import { useChallengeRouteData } from '~/app/challenge-route-data.hook';
import { SORT_KEYS, useProblemExplorerContext } from '~/app/problem-explorer.hooks';
import { useRouter } from 'next/navigation';
import { useAllChallengesContext } from '~/app/all-challenges.hook';

export function ExplorerPanel() {
  const router = useRouter();
  const { getTrack, setTrack, title, setTitle, sortKey, setSortKey } = useProblemExplorerContext();
  const { allChallenges } = useAllChallengesContext();

  const handleValueChange = (value: string) => {
    document.cookie = 'trackName='; // clear the old cookie first
    if (value === 'popular') {
      router.push(`/challenge/${allChallenges.popularChallenges[0]?.slug}`);
      setTitle('Recommended Challenges');
      setTrack(allChallenges.popularChallenges);
      document.cookie = 'trackName=popular';
    }
    if (value === 'beginner') {
      router.push(`/challenge/${allChallenges.beginnerChallenges[0]?.slug}`);
      setTitle('Great for Beginners');
      setTrack(allChallenges.beginnerChallenges);
      document.cookie = 'trackName=beginner';
    }
    if (value === 'easy') {
      router.push(`/challenge/${allChallenges.easyChallenges[0]?.slug}`);
      setTitle('Great for Learners');
      setTrack(allChallenges.easyChallenges);
      document.cookie = 'trackName=easy';
    }
    if (value === 'medium') {
      router.push(`/challenge/${allChallenges.mediumChallenges[0]?.slug}`);
      setTitle('Great for Enthusiasts');
      setTrack(allChallenges.mediumChallenges);
      document.cookie = 'trackName=medium';
    }
    if (value === 'hard') {
      router.push(`/challenge/${allChallenges.hardChallenges[0]?.slug}`);
      setTitle('Great for Experts');
      setTrack(allChallenges.hardChallenges);
      document.cookie = 'trackName=hard';
    }
    if (value === 'extreme') {
      router.push(`/challenge/${allChallenges.extremeChallenges[0]?.slug}`);
      setTitle('Great for Masters');
      setTrack(allChallenges.extremeChallenges);
      document.cookie = 'trackName=extreme';
    }
    setSortKey(SORT_KEYS.find((sk) => sk.value === value) ?? SORT_KEYS[0]);
  };

  const { currentChallenge } = useChallengeRouteData();

  const challenges = getTrack;
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

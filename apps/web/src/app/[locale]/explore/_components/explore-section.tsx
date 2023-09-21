import type { Difficulty, Tags } from '@repo/db/types';
import Link from 'next/link';
import { ExploreCard } from './explore-card';
import type { ExploreChallengeData } from './explore.action';
import { ViewMoreButton } from './view-more-button';
import { Carousel } from '~/components/ui/carousel';

interface SectionProps {
  title: string;
  fetcher: (tagOrDifficulty: string, take: number) => ExploreChallengeData;
  /**
   * This is used by UI to apply the right colors. You still need to manually specify the
   * `redirectRoute` for view-more button to work.
   */
  tag: Difficulty | Tags;
  /**
   * The route view-more button takes.
   */
  redirectRoute: string;
}

const difficultyToNumber = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
} as const;

const TITLES_BY_TAG = {
  POPULAR: '',
  NEWEST: '',
  BEGINNER:
    'bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-500 dark:from-sky-500 dark:to-sky-200',
  EASY: 'bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 dark:from-green-300 dark:to-green-100',
  MEDIUM:
    'bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-300 dark:to-yellow-100',
  HARD: 'bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500 dark:from-red-300 dark:to-red-100',
  EXTREME:
    'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-100',
};

export const COLORS_BY_TAGS = {
  POPULAR: 'dark:bg-pink-300 bg-pink-600/50',
  NEWEST: 'dark:bg-orange-300 bg-orange-500/50',
  BEGINNER: 'dark:bg-blue-300 bg-blue-600/50',
  EASY: 'dark:bg-green-300 bg-green-500/50',
  MEDIUM: 'dark:bg-yellow-300 bg-yellow-600/50',
  HARD: 'dark:bg-red-300 bg-red-600/50',
  EXTREME: 'dark:bg-purple-300 bg-purple-600/50',
} as const;

export async function ExploreSection({ title, fetcher, tag, redirectRoute }: SectionProps) {
  const challenges = await fetcher(tag.trim().toUpperCase(), 6);
  return (
    <div>
      <div className="container flex items-center justify-between gap-3 px-4 pt-5">
        <h2 className={`relative text-3xl font-bold tracking-tight ${TITLES_BY_TAG[tag]}`}>
          <div
            className={`absolute -left-8 -z-10 h-12 w-32 rounded-full bg-pink-300/50 blur-3xl ${COLORS_BY_TAGS[tag]}`}
          />
          {title}
        </h2>
        <ViewMoreButton redirectRoute={redirectRoute} tag={tag} />
      </div>
      <section className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem]">
        <Carousel>
          {challenges
            .sort((a, b) =>
              difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
                ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
                : a.name.localeCompare(b.name),
            )
            .map((challenge) => (
              <Link
                className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
                href={`/challenge/${challenge.id}`}
                key={challenge.id}
              >
                <ExploreCard challenge={challenge} key={`challenge-${challenge.id}`} />
              </Link>
            ))}
        </Carousel>
      </section>
    </div>
  );
}

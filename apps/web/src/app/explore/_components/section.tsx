import { Diamond } from '@repo/ui/icons';
import type { Difficulty, Tags } from '@repo/db/types';
import type { ExploreChallengeData } from './explore.action';
import { ExploreCarousel } from './section-carousel';
import { ViewMoreButton } from './view-more-button';

interface Props {
  title: string;
  fetcher: (tagOrDifficulty: string, take: number) => ExploreChallengeData;
  /**
   * Slug for querying challenges on `/explore/<slug>`.
   * - Make sure it's either a `DIFFICULTY` or `TAGS`. Anything else will return in not found.
   * - Case doesn't matter since we trim & uppercase before querying db.
   */
  moreRoute: Difficulty | Tags;
}

const TITLES_BY_DIFFICULTY = {
  POPULAR: '',
  NEWEST: '',
  BEGINNER:
    'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-500 dark:from-pink-500 dark:to-pink-200',
  EASY: 'bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500 dark:from-green-300 dark:to-green-100',
  MEDIUM:
    'bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-300 dark:to-yellow-100',
  HARD: 'bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500 dark:from-red-300 dark:to-red-100',
  EXTREME:
    'bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-100',
};

const COLORS_BY_DIFFICULTY = {
  POPULAR: 'dark:bg-pink-300 bg-pink-600/50',
  NEWEST: 'dark:bg-orange-300 bg-orange-500/50',
  BEGINNER: 'dark:bg-pink-300 bg-pink-600/50',
  EASY: 'dark:bg-green-300 bg-green-500/50',
  MEDIUM: 'dark:bg-yellow-300 bg-yellow-600/50',
  HARD: 'dark:bg-red-300 bg-red-600/50',
  EXTREME: 'dark:bg-orange-300 bg-orange-600/50',
};

export async function ExploreSection({ title, fetcher, moreRoute }: Props) {
  const challenges = await fetcher(moreRoute.trim().toUpperCase(), 6);
  return (
    <div>
      <div className="container flex items-center justify-between gap-3 px-4 pt-5">
        <h2
          className={`relative text-3xl font-bold tracking-tight ${TITLES_BY_DIFFICULTY[moreRoute]}`}
        >
          <div
            className={`absolute -left-8 -z-10 h-12 w-32 rounded-full bg-pink-300/50 blur-3xl ${COLORS_BY_DIFFICULTY[moreRoute]}`}
          />
          {title}
        </h2>
        <ViewMoreButton challenges={challenges} moreRoute={moreRoute} />
      </div>
      <section className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem]">
        <ExploreCarousel challenges={challenges} />
      </section>
    </div>
  );
}

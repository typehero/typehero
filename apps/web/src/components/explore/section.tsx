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

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'bg-gradient-to-r from-50% from-pink-600/10 dark:from-pink-500/10',
  EASY: 'bg-gradient-to-r from-50% from-green-600/10 dark:from-green-500/10',
  MEDIUM: 'bg-gradient-to-r from-50% from-yellow-600/10 dark:from-yellow-500/10',
  HARD: 'bg-gradient-to-r from-50% from-red-600/10 dark:from-red-500/10',
  EXTREME: 'bg-gradient-to-r from-50% from-orange-600/10 dark:from-orange-500/10',
};

const TITLES_BY_DIFFICULTY = {
  BEGINNER: 'bg-gradient-to-r from-pink-500 to-pink-500 dark:from-pink-500 dark:to-pink-200',
  EASY: 'bg-gradient-to-r from-green-500 to-green-500 dark:from-green-500 dark:to-green-200',
  MEDIUM: 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-500 dark:to-yellow-200',
  HARD: 'bg-gradient-to-r from-red-500 to-red-500 dark:from-red-500 dark:to-red-200',
  EXTREME: 'bg-gradient-to-r from-orange-500 to-orange-500 dark:from-orange-500 dark:to-orange-200',
};

export async function ExploreSection({ title, fetcher, moreRoute }: Props) {
  const challenges = await fetcher(moreRoute.trim().toUpperCase(), 6);
  return (
    <section
      className={`relative flex w-full flex-col overflow-hidden rounded-[2.5rem] ${
        COLORS_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']
      }`}
    >
      {challenges[0]?.difficulty === 'EASY' && (
        <>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[5%] translate-y-[255%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[130%] translate-y-[130%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[265%] translate-y-[5%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[260%] translate-y-[260%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[395%] translate-y-[135%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[525%] translate-y-[265%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[535%] translate-y-[15%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[665%] translate-y-[145%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[795%] translate-y-[275%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10" />
        </>
      )}

      <div className="flex items-center justify-between gap-3 p-5 pb-0 pl-7">
        {/* <div className="hidden w-[117px] md:block"></div> */}
        <h2
          className={`bg-clip-text text-3xl font-bold tracking-tight text-transparent ${
            TITLES_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']
          }`}
        >
          {title}
        </h2>
        <ViewMoreButton challenges={challenges} moreRoute={moreRoute} />
      </div>
      <ExploreCarousel challenges={challenges} />
    </section>
  );
}

import { Suspense } from 'react';
import { getChallengesByTagOrDifficulty } from './explore.action';
import { ExploreSection } from './section';
import { ExploreSectionSkeleton } from './section-skeleton';
import { Footsies } from '~/components/ui/footsies';

// CI fails without this
export const dynamic = 'force-dynamic';

export async function Explore() {
  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h3 className="mb-1 text-2xl font-bold tracking-wide text-neutral-900/40 dark:text-white/40">
          Welcome to
        </h3>
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          TypeHero Explore
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          Explore the challenges. Embrace the opportunity to grow, learn, and showcase your
          programming abilities. We hope you find the{' '}
          <span className="font-semibold dark:text-neutral-200">perfect</span> challenge!
        </p>
      </div>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="💕 Most Popular"
          fetcher={getChallengesByTagOrDifficulty}
          moreRoute="POPULAR"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="🔥 Newest"
          fetcher={getChallengesByTagOrDifficulty}
          moreRoute="NEWEST"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Beginners"
          fetcher={getChallengesByTagOrDifficulty}
          moreRoute="EASY"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Enthusiasts"
          fetcher={getChallengesByTagOrDifficulty}
          moreRoute="MEDIUM"
        />
      </Suspense>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="For the Experts"
          fetcher={getChallengesByTagOrDifficulty}
          moreRoute="HARD"
        />
      </Suspense>
      <Footsies />
    </div>
  );
}

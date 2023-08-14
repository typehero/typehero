import { Suspense } from 'react';
import { getChallangesByTagOrDifficulty } from './explore.action';
import { ExploreSection } from './section';
import { ExploreSectionSkeleton } from './section-skeleton';

// CI fails without this
export const dynamic = 'force-dynamic';

export async function Explore() {
  return (
    <div className="container flex flex-col items-center gap-8 py-5 md:gap-20 md:pb-20">
      <p className="max-w-[66ch] px-4 text-lg leading-10 text-neutral-600 dark:text-neutral-400 md:text-center">
        Explore the challenges. Embrace the opportunity to grow, learn, and showcase your
        programming abilities. We hope you find the{' '}
        <span className="font-semibold dark:text-neutral-200">perfect</span> challenge!
      </p>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Most Popular"
          fetcher={getChallangesByTagOrDifficulty}
          moreRoute="popular"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Newest"
          fetcher={getChallangesByTagOrDifficulty}
          moreRoute="newest"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Beginners"
          fetcher={getChallangesByTagOrDifficulty}
          moreRoute="easy"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Enthusiasts"
          fetcher={getChallangesByTagOrDifficulty}
          moreRoute="medium"
        />
      </Suspense>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="For the Experts"
          fetcher={getChallangesByTagOrDifficulty}
          moreRoute="hard"
        />
      </Suspense>
    </div>
  );
}

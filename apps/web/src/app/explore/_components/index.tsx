import { Suspense } from 'react';
import { Footsies } from '~/components/footsies';
import { ExploreSection } from './explore-section';
import { ExploreSectionSkeleton } from './explore-section-skeleton';
import { BootPromo } from '../../_components/boot-promo';

export const dynamic = 'force-dynamic';

export function Explore() {
  return (
    <>
      <div className="flex flex-col py-8">
        <div className="container text-center">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Explore
          </h1>
        </div>
        <div className="container flex items-center justify-center">
          <BootPromo />
        </div>
        <div className="flex flex-col gap-8 py-8">
          <Suspense fallback={<ExploreSectionSkeleton />}>
            <ExploreSection
              title="Great for Beginners"
              tag="BEGINNER"
              redirectRoute="/explore/beginner"
            />
          </Suspense>
          <Suspense fallback={<ExploreSectionSkeleton />}>
            <ExploreSection title="Great for Learners" tag="EASY" redirectRoute="/explore/easy" />
          </Suspense>
          <Suspense fallback={<ExploreSectionSkeleton />}>
            <ExploreSection
              title="Great for Enthusiasts"
              tag="MEDIUM"
              redirectRoute="/explore/medium"
            />
          </Suspense>
          <Suspense fallback={<ExploreSectionSkeleton />}>
            <ExploreSection title="Great for Experts" tag="HARD" redirectRoute="/explore/hard" />
          </Suspense>
          <Suspense fallback={<ExploreSectionSkeleton />}>
            <ExploreSection
              title="Great for Masters"
              tag="EXTREME"
              redirectRoute="/explore/extreme"
            />
          </Suspense>
        </div>
      </div>
      <Footsies />
    </>
  );
}

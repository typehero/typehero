import { auth } from '@repo/auth/server';
import { Suspense } from 'react';
import { Footsies } from '~/components/footsies';
import { ExploreSection } from './explore-section';
import { ExploreSectionSkeleton } from './explore-section-skeleton';

// CI fails without this
export const dynamic = 'force-dynamic';

export async function Explore() {
  const session = await auth();

  return (
    <>
      <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-8">
        <div className="container text-center">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Explore
          </h1>
          <p className="mx-auto max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
            Explore the challenges. Embrace the opportunity to grow, learn, and showcase your
            programming abilities. We hope you find the{' '}
            <span className="font-semibold dark:text-neutral-200">perfect</span> challenge!
          </p>
        </div>
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
      <Footsies />
    </>
  );
}

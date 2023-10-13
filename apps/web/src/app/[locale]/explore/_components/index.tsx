import { getServerAuthSession } from '@repo/auth/server';
import { Suspense } from 'react';
import { Footsies } from '~/components/footsies';
import { ExploreSection } from './explore-section';
import { ExploreSectionSkeleton } from './explore-section-skeleton';
import { getChallengesByTagOrDifficulty } from './explore.action';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { redirect } from 'next/navigation';

// CI fails without this
export const dynamic = 'force-dynamic';

export async function Explore() {
  const session = await getServerAuthSession();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Explore
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
          tag="POPULAR"
          redirectRoute="/explore/popular"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="🔥 Newest"
          fetcher={getChallengesByTagOrDifficulty}
          tag="NEWEST"
          redirectRoute="/explore/newest"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Beginners"
          fetcher={getChallengesByTagOrDifficulty}
          tag="BEGINNER"
          redirectRoute="/explore/beginner"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Learners"
          fetcher={getChallengesByTagOrDifficulty}
          tag="EASY"
          redirectRoute="/explore/easy"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Enthusiasts"
          fetcher={getChallengesByTagOrDifficulty}
          tag="MEDIUM"
          redirectRoute="/explore/medium"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Experts"
          fetcher={getChallengesByTagOrDifficulty}
          tag="HARD"
          redirectRoute="/explore/hard"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Masters"
          fetcher={getChallengesByTagOrDifficulty}
          tag="EXTREME"
          redirectRoute="/explore/extreme"
        />
      </Suspense>
      <Footsies />
    </div>
  );
}

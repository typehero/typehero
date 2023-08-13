import { prisma } from '@repo/db';
import type { Difficulty, Tags } from '@repo/db/types';
import { Suspense } from 'react';
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
          challenges={await getChallengesByTags('POPULAR')}
          moreRoute="popular"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Newest"
          challenges={await getChallengesByTags('NEWEST')}
          moreRoute="newest"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Beginners"
          challenges={await getChallengesByDifficulty('EASY')}
          moreRoute="easy"
        />
      </Suspense>
      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="Great for Enthusiasts"
          challenges={await getChallengesByDifficulty('MEDIUM')}
          moreRoute="medium"
        />
      </Suspense>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection
          title="For the Experts"
          challenges={await getChallengesByDifficulty('HARD')}
          moreRoute="hard"
        />
      </Suspense>
    </div>
  );
}

export type ExploreChallengeData =
  | Awaited<ReturnType<typeof getChallengesByDifficulty>>
  | Awaited<ReturnType<typeof getChallengesByTags>>;

/**
 * Fetch challenges by given difficulty.
 */
async function getChallengesByDifficulty(difficulty: Difficulty) {
  return prisma.challenge.findMany({
    where: {
      status: 'ACTIVE',
      difficulty: { in: [difficulty] },
      user: {
        NOT: {
          status: 'BANNED',
        },
      },
    },
    include: {
      _count: {
        select: { vote: true, comment: true },
      },
      user: true,
    },
    take: 6,
  });
}

/**
 * Fetch challenges by tags.
 */
async function getChallengesByTags(tags: Tags) {
  return prisma.challenge.findMany({
    where: {
      status: 'ACTIVE',
      tags: {
        every: {
          tag: tags,
        },
      },
      user: {
        NOT: {
          status: 'BANNED',
        },
      },
    },
    include: {
      _count: {
        select: { vote: true, comment: true, tags: true },
      },
      user: true,
    },
    take: 6,
  });
}

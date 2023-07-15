import { Suspense } from 'react';
import { prisma } from '~/server/db';
import { ExploreSection } from './section';
import { ExploreSectionSkeleton } from './section-skeleton';

// CI fails without this
export const dynamic = 'force-dynamic';

export async function Explore() {
  return (
    <div className="container flex h-full flex-col">
      <p className="max-w-[66ch] bg-transparent pt-5 text-justify text-lg leading-10 text-neutral-600 dark:text-neutral-400">
        <span className="text-xl font-bold text-[#3178c6]">Explore</span> the challenges. Embrace
        the opportunity to grow, learn, and showcase your programming abilities. We hope you find
        the <span className="font-semibold text-neutral-200">perfect</span> challenge!
      </p>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection title="Great for Beginners" fetcher={getEasyChallenges} />
      </Suspense>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection title="Great for Enthusiasts" fetcher={getMediumChallenges} />
      </Suspense>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection title="For the Experts" fetcher={getHardChallenges} />
      </Suspense>
    </div>
  );
}

export type ExploreChallengeData = Awaited<ReturnType<typeof getEasyChallenges>>;
async function getEasyChallenges() {
  return prisma.challenge.findMany({
    where: {
      visibility: 'VISIBLE',
      difficulty: { in: ['EASY'] },
    },
    include: {
      _count: {
        select: { vote: true, comment: true },
      },
    },
    take: 6,
  });
}

async function getMediumChallenges() {
  return prisma.challenge.findMany({
    where: {
      visibility: 'VISIBLE',
      difficulty: { in: ['MEDIUM'] },
    },
    include: {
      _count: {
        select: { vote: true, comment: true },
      },
    },
    take: 6,
  });
}

async function getHardChallenges() {
  return prisma.challenge.findMany({
    where: {
      visibility: 'VISIBLE',
      difficulty: { in: ['HARD'] },
    },
    include: {
      _count: {
        select: { vote: true, comment: true },
      },
    },
    take: 6,
  });
}

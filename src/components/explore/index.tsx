import { Suspense } from 'react';
import { prisma } from '~/server/db';
import { ExploreSection } from './section';
import { ExploreSectionSkeleton } from './section-skeleton';

export async function Explore() {
  return (
    <div className="container flex h-full flex-col">
      <section className="mb-8 flex max-w-[69ch] flex-col items-start gap-2">
        <h1 className="my-4 bg-gradient-to-r from-[#3178C6] from-30% to-black bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:to-white md:text-6xl lg:my-6"></h1>
      </section>

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

import { Suspense } from 'react';
import { prisma } from '~/server/db';
import { ExploreSection } from './section';
import { ExploreSectionSkeleton } from './section-skeleton';

export async function Explore() {
  const data = await getExploreChallengeData();

  return (
    <div className="container flex h-full flex-col">
      <section className="mb-8 flex max-w-[69ch] flex-col items-start gap-2">
        <h1 className="my-4 bg-gradient-to-r from-[#3178C6] from-30% to-black bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:to-white md:text-6xl lg:my-6">
          <span className="mb-2 block text-2xl md:text-4xl">Welcome to</span> Type Hero Explore
        </h1>
      </section>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection data={data} />
      </Suspense>
    </div>
  );
}

export type ExploreChallengeData = Awaited<ReturnType<typeof getExploreChallengeData>>;
async function getExploreChallengeData() {
  return prisma.challenge.findMany({
    where: {
      visibility: 'VISIBLE',
    },
    include: {
      _count: {
        select: { vote: true, comment: true, submission: true },
      },
    },
  });
}

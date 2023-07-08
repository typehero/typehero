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
          Explore
        </h1>
        <p className="leading-loose text-neutral-700 dark:text-neutral-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum
        </p>
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
      disabled: false,
    },
    include: {
      _count: {
        select: { vote: true, comment: true, solution: true },
      },
    },
  });
}

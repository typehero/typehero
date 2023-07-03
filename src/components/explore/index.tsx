import { prisma } from '~/server/db';
import { TypographyP } from '../ui/paragraph';
import { TypographyH1 } from '../ui/typography/h1';
import { ExploreSection } from './section';
import { Suspense } from 'react';
import { ExploreSectionSkeleton } from './section-skeleton';

export function Explore() {
  return (
    <div className="container flex h-full flex-col">
      <section className="mb-8 flex max-w-[69ch] flex-col items-start gap-2 px-2 pt-4 md:pt-8">
        <TypographyH1 className="bg-gradient-to-r from-[#3178C6] from-30% to-black bg-clip-text text-transparent dark:to-white">
          Explore
        </TypographyH1>
        <TypographyP>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum
        </TypographyP>
      </section>

      <Suspense fallback={<ExploreSectionSkeleton />}>
        <ExploreSection data={getChallenge} />
      </Suspense>
    </div>
  );
}

export type Challenge = ReturnType<typeof getChallenge>;
async function getChallenge() {
  return prisma.challenge.findMany({
    include: {
      _count: {
        select: { Vote: true },
      },
    },
  });
}

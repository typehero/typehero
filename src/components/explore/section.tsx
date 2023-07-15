import Link from 'next/link';

import Card from './explore-card';

import type { ExploreChallengeData } from '.';
import type { Difficulty } from '@prisma/client';
import { Button } from '../ui/button';

interface Props {
  title: string;
  fetcher: () => Promise<ExploreChallengeData>;
}

const difficultyToNumber: Record<Difficulty, number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
};

export async function ExploreSection({ title, fetcher }: Props) {
  const challenges = await fetcher();
  return (
    <section className="py-5">
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-3xl font-semibold tracking-tight text-black text-transparent dark:text-white  md:text-4xl lg:my-6">
          {title}
        </h2>
        <Button variant="ghost" className="rounded-md p-2">
          view more
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges
          .sort((a, b) =>
            difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
              ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
              : a.name.localeCompare(b.name),
          )
          .map((challenge) => (
            <Link
              className="group focus:outline-none"
              href={`/challenge/${challenge.id}`}
              key={challenge.id}
            >
              <Card key={`challenge-${challenge.id}`} challenge={challenge} />
            </Link>
          ))}
      </div>
    </section>
  );
}

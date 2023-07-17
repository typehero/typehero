import Link from 'next/link';

import Card from './explore-card';

import type { ExploreChallengeData } from '.';
import type { Difficulty } from '@prisma/client';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

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

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:text-pink-400 text-pink-600',
  EASY: 'dark:text-green-400 text-green-600',
  MEDIUM: 'dark:text-yellow-400 text-yellow-600',
  HARD: 'dark:text-red-400 text-red-600',
  EXTREME: 'dark:text-orange-400 text-orange-600',
};

export async function ExploreSection({ title, fetcher }: Props) {
  const challenges = await fetcher();
  return (
    <section className="py-5">
      <div className="flex items-center justify-between">
        <div className="hidden w-[117px] md:block"></div>
        <h2
          className={`my-4 pl-4 text-xl font-semibold tracking-tight md:pl-0 md:text-2xl lg:my-6 ${
            COLORS_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']
          }`}
        >
          {title}
        </h2>
        <Button variant="ghost" className="group items-center rounded-full px-4 py-2">
          view more
          <ChevronRight className="h-4 w-4 duration-300 group-hover:translate-x-2" />
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

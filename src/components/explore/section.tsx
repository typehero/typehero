import Link from 'next/link';

import { ExploreCard } from './explore-card';

import type { ExploreChallengeFetcher } from '.';
import type { Difficulty } from '@prisma/client';
import { Button } from '../ui/button';
import { ChevronRight, Circle, Diamond, Plus, Sparkle, Triangle } from 'lucide-react';

interface Props {
  title: string;
  fetcher: ExploreChallengeFetcher;
}

const difficultyToNumber: Record<Difficulty, number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
};

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'bg-pink-500/10',
  EASY: 'bg-green-500/10',
  MEDIUM: 'bg-yellow-500/10',
  HARD: 'bg-red-500/10',
  EXTREME: 'bg-orange-500/10',
};

export async function ExploreSection({ title, fetcher }: Props) {
  const challenges = await fetcher();
  return (
    <section
      className={`relative flex w-full flex-col overflow-hidden rounded-[2.5rem] ${
        COLORS_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']
      }`}
    >
      {challenges[0]?.difficulty === 'BEGINNER' && (
        <>
          <Circle className="absolute -right-4 -top-8 h-24 w-24 origin-top-right stroke-1 text-white/30 duration-300 group-hover:scale-90 dark:group-hover:text-black/30"></Circle>
          <Circle className="absolute -right-4 -top-8 h-32 w-32 origin-top-right stroke-1 text-white/30 duration-500 group-hover:scale-90 dark:group-hover:text-black/30"></Circle>
        </>
      )}
      {challenges[0]?.difficulty === 'EASY' && (
        <>
          {/* <div className="absolute bottom-0 h-80 w-80 -translate-x-24 translate-y-28 -rotate-45 rounded-[3rem] bg-green-500/10 "></div>
          <div className="absolute bottom-0 h-[24rem] w-[24rem] -translate-x-24 translate-y-32 -rotate-45 rounded-[4rem] bg-green-500/10 "></div> */}
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 origin-top-right stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute right-16 top-24 h-24 w-24 origin-top-right stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -top-10 right-48 h-24 w-24 origin-top-right stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 origin-top-right translate-y-64 stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute right-16 top-24 h-24 w-24 origin-top-right translate-y-64 stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -top-10 right-48 h-24 w-24 origin-top-right translate-y-64 stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 origin-top-right -translate-x-80 translate-y-[7.5rem] stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute right-16 top-24 h-24 w-24 origin-top-right -translate-x-80 translate-y-[7.5rem] stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -top-10 right-48 h-24 w-24 origin-top-right -translate-x-80 translate-y-[7.5rem] stroke-1 text-green-500/10 duration-300 group-hover:scale-90  dark:group-hover:text-black/30"></Diamond>
        </>
      )}
      {challenges[0]?.difficulty === 'MEDIUM' && (
        <>
          <Triangle className="absolute -right-4 -top-6 h-20 w-20 rotate-[40deg] stroke-2 text-white/50 duration-200 group-hover:rotate-0 group-hover:scale-50 dark:group-hover:text-black/30"></Triangle>
          <Triangle className="absolute -right-12 -top-14 h-36 w-36 rotate-45 stroke-1 text-white/50 duration-300 group-hover:h-32 group-hover:w-32 group-hover:rotate-[20deg] dark:group-hover:text-black/30"></Triangle>
        </>
      )}
      {challenges[0]?.difficulty === 'HARD' && (
        <>
          <Plus className="absolute -right-4 -top-8 h-24 w-24 stroke-1 text-white/30 duration-300 group-hover:scale-0 dark:group-hover:text-black/30"></Plus>
          <Plus className="absolute -right-4 -top-8 h-32 w-32 stroke-1 text-white/30 duration-500 group-hover:scale-[3] dark:group-hover:text-black/30"></Plus>
        </>
      )}
      {challenges[0]?.difficulty === 'EXTREME' && (
        <>
          <Sparkle className="absolute -right-4 -top-10 h-24 w-24 stroke-1 text-white/40 duration-500 group-hover:-translate-x-4 group-hover:translate-y-10 group-hover:-rotate-[125deg] dark:group-hover:text-black/30"></Sparkle>
          <Sparkle className="absolute -right-12 -top-20 h-48 w-48 origin-top-right stroke-1 text-white/40 duration-300 group-hover:scale-50 dark:group-hover:text-black/30"></Sparkle>
        </>
      )}
      <div className="flex items-center justify-between p-5 pb-0 pl-7">
        {/* <div className="hidden w-[117px] md:block"></div> */}
        <h2
          className={`z-10 bg-gradient-to-r from-green-600 to-green-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent`}
        >
          {title}
        </h2>
        <Button
          variant="ghost"
          className="group z-10 items-center whitespace-nowrap rounded-full bg-green-500/20 py-2 pl-3 pr-2 text-green-700 hover:bg-green-500/30 dark:bg-green-300/10 dark:text-green-300 dark:hover:bg-green-300/20"
        >
          view more
          <ChevronRight className="ml-1 h-4 w-4 duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
      <div className="hide-scrollbar flex w-full snap-x flex-nowrap gap-4 overflow-x-scroll p-4">
        {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> */}
        {challenges
          .sort((a, b) =>
            difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
              ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
              : a.name.localeCompare(b.name),
          )
          .map((challenge) => (
            <>
              <Link
                className="group w-[400px] snap-center focus:outline-none"
                href={`/challenge/${challenge.id}`}
                key={challenge.id}
              >
                <ExploreCard key={`challenge-${challenge.id}`} challenge={challenge} />
              </Link>
              <Link
                className="group w-[400px] snap-center focus:outline-none"
                href={`/challenge/${challenge.id}`}
                key={challenge.id}
              >
                <ExploreCard key={`challenge-${challenge.id}`} challenge={challenge} />
              </Link>
            </>
          ))}
        {/* </div> */}
      </div>
    </section>
  );
}

'use client';
import { ArrowUp, MessageCircle, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';
import type { Challenge } from '.';

interface Props {
  challenge: NonNullable<Challenge>;
}
export function Solutions({ challenge }: Props) {
  const hasSolution = challenge.Solution?.length > 0;

  const handleClick = () => {
    console.log('do stuff');
  };

  return (
    <>
      <div className="sticky right-0 top-[41px] z-10 flex h-full items-center justify-between border-b border-zinc-300 bg-background/90 bg-opacity-20 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
        <div className="flex gap-2">
          <div className="flex gap-2 rounded-xl bg-blue-600/10 px-4 py-1 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            All
          </div>
          <div className="flex gap-2 rounded-xl bg-black/5 px-4 py-1 text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
            Tag 2
          </div>
        </div>
        <Button
          className="h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
          onClick={() => handleClick()}
          disabled={!hasSolution}
        >
          <Plus className="mr-2 h-4 w-4" /> Solution
        </Button>
      </div>
      <div className="relative flex flex-col">
        <SolutionRow />
        <SolutionRow />
        <SolutionRow />
        <SolutionRow />
        <SolutionRow />
        <SolutionRow />
        <SolutionRow />
        <SolutionRow />
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SolutionRow() {
  const date = new Date();
  return (
    <div className="flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-neutral-700">
      <h3 className="font-bold">🔥🔥Some | LeetCodeLooking✅ | Title🔥🔥</h3>
      <div className="mb-2 flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <div className="rounded-lg bg-neutral-200 pl-1 pr-2 font-bold dark:bg-neutral-700 dark:text-neutral-300">
          @&nbsp;username goes here
        </div>
        <div>{date.toLocaleString()}</div>
      </div>
      <div className="flex gap-5 text-neutral-600 duration-300 dark:text-neutral-400">
        <button className="flex items-center gap-2 rounded-full bg-emerald-600/10 p-2 pr-3 text-emerald-600 duration-300 hover:bg-emerald-400/20 dark:bg-emerald-400/20 dark:text-emerald-400">
          <ArrowUp className="stroke-1" /> 70
        </button>
        <button className="flex items-center gap-2 rounded-full bg-white/5 p-2 pr-3 duration-300 hover:bg-black/20 only:dark:hover:bg-white/20">
          <MessageCircle className="stroke-1" /> 69
        </button>
      </div>
    </div>
  );
}

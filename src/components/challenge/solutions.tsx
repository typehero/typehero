'use client';
import { ArrowUp, MessageCircle, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { TypographyH3 } from '../ui/typography/h3';
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
    <div className="relative flex flex-col gap-4">
      <div className="sticky right-0 top-0 flex h-full items-center justify-between px-2 py-1">
        <div className="flex gap-2">
          <div className="flex gap-2 rounded-full bg-blue-600/10 px-4 py-1 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            All
          </div>
          <div className="flex gap-2 rounded-full bg-black/5 px-4 py-1 text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
            Tag 2
          </div>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
          onClick={() => handleClick()}
          disabled={!hasSolution}
        >
          <Plus className="mr-2 h-4 w-4" /> Solution
        </Button>
      </div>
      <SolutionRow />
      <SolutionRow2 />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SolutionRow() {
  const date = new Date();
  return (
    <div className="flex  cursor-pointer flex-col gap-2 rounded-3xl p-4 duration-300 hover:bg-neutral-200 dark:rounded-none dark:hover:bg-neutral-700">
      <TypographyH3>🔥🔥Some | LeetCodeLooking✅ | Title🔥🔥</TypographyH3>
      <div className="flex gap-2 text-neutral-600 dark:text-neutral-400">
        <div>
          <b>username</b> goes here
        </div>
        <div>{date.toLocaleString()}</div>
      </div>
      <div className="flex gap-5 text-neutral-600 duration-300 dark:text-neutral-400">
        <button className="flex items-center gap-2 rounded-full bg-emerald-600/10 p-2 pr-3  text-emerald-600 duration-300 hover:bg-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-400">
          <ArrowUp className="stroke-1" /> 70
        </button>
        <button className="flex items-center gap-2 rounded-full bg-white/5 p-2 pr-3 duration-300 hover:bg-black/20 only:dark:hover:bg-white/20">
          <MessageCircle className="stroke-1" /> 69
        </button>
      </div>
    </div>
  );
}

// TODO: nuke this
function SolutionRow2() {
  const date = new Date();
  return (
    <div className="flex  cursor-pointer flex-col gap-2 rounded-3xl p-4 duration-300 hover:bg-neutral-200 dark:rounded-none dark:hover:bg-neutral-700">
      <TypographyH3>C++ VS Rust</TypographyH3>
      <div className="flex gap-2 text-neutral-600 dark:text-neutral-400">
        <div>
          <b>username</b> goes here
        </div>
        <div>{date.toLocaleString()}</div>
      </div>
      <div className="flex gap-5 text-neutral-600 duration-300 dark:text-neutral-400">
        <button className="flex items-center gap-2 rounded-full bg-white/5 p-2 pr-3 duration-300 hover:bg-black/20 only:dark:hover:bg-white/20">
          <ArrowUp className="stroke-1" /> 69
        </button>
        <button className="flex items-center gap-2 rounded-full bg-white/5 p-2 pr-3 duration-300 hover:bg-black/20 only:dark:hover:bg-white/20">
          <MessageCircle className="stroke-1" /> 69
        </button>
      </div>
    </div>
  );
}

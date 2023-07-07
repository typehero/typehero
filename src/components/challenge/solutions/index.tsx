'use client';
import { ArrowUp, MessageCircle, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';

import { SolutionEditor } from './solution-editor';
import { useState } from 'react';
import { getRelativeTime } from '~/utils/relativeTime';
import { type Challenge } from '~/app/challenge/[id]/page';

interface Props {
  challenge: NonNullable<Challenge>;
}
export function Solutions({ challenge }: Props) {
  const hasSolution = challenge.solution?.length > 0;
  const [openSolutionEditor, setOpenSolutionEditor] = useState(false);

  const sharedSolution = challenge.sharedSolution;

  const handleClick = () => {
    setOpenSolutionEditor(true);
  };

  return (
    <div className="relative h-full">
      {openSolutionEditor ? (
        <SolutionEditor challenge={challenge} setOpen={setOpenSolutionEditor} />
      ) : (
        <>
          <div className="sticky right-0 top-[41px] z-10 flex items-center justify-between border-b border-zinc-300 bg-background/90 bg-opacity-20 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <div className="flex gap-2">
              <div className="flex gap-2 rounded-xl bg-blue-600/10 px-4 py-1 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                All
              </div>
              <div className="flex gap-2 rounded-xl bg-black/5 px-4 py-1 text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
                generics
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

          {sharedSolution.map((solution) => (
            <SolutionRow key={solution.id} solution={solution} />
          ))}
        </>
      )}
    </div>
  );
}

function SolutionRow({
  solution,
}: {
  solution: NonNullable<NonNullable<Challenge>['sharedSolution'][0]>;
}) {
  return (
    <div className="group flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-neutral-700">
      <h3 className="font-bold">{solution.title}</h3>
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <div className="rounded-full bg-neutral-200 px-2 py-1 text-xs font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
          {solution.user?.name}
        </div>
        <div>{getRelativeTime(solution.createdAt)}</div>
      </div>
      <div className="flex gap-3 text-neutral-600 duration-300 dark:text-neutral-400">
        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-emerald-600/10 px-2 py-1 text-sm text-emerald-600 duration-300 hover:bg-emerald-400/40 dark:bg-emerald-400/20 dark:text-emerald-400 dark:hover:bg-emerald-400/40">
          <ArrowUp className="h-4 w-4 stroke-1" /> {solution._count.vote}
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-black/5 px-2 py-1 text-sm duration-300 hover:bg-black/20 dark:bg-white/5 dark:hover:bg-white/20">
          <MessageCircle className="h-4 w-4 stroke-1" /> {solution._count.solutionComment}
        </button>
      </div>
    </div>
  );
}

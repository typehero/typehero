'use client';
import { ArrowLeft, ArrowUp, Lock, MessageCircle, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';

import { SolutionEditor } from './solution-editor';
import { useState } from 'react';
import { getRelativeTime } from '~/utils/relativeTime';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { useSession } from 'next-auth/react';

interface Props {
  challenge: ChallengeRouteData;
}
export function Solutions({ challenge }: Props) {
  const hasSolution = challenge.solution?.length > 0;
  const [openSolutionEditor, setOpenSolutionEditor] = useState(false);
  const session = useSession();

  const sharedSolution = challenge.sharedSolution;

  const handleClick = () => {
    setOpenSolutionEditor(true);
  };

  return (
    <div className="relative h-full">
      {openSolutionEditor ? (
        session.status === 'authenticated' ? (
          <SolutionEditor challenge={challenge} setOpen={setOpenSolutionEditor} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Lock className="h-8 w-8" />
              <span className="max-w-[40ch] text-center text-black/50 dark:text-white/50">
                You need to be logged in to post a solution.
              </span>
            </div>
            <Button
              variant={'ghost'}
              className="gap-2"
              onClick={() => {
                setOpenSolutionEditor(!openSolutionEditor);
              }}
            >
              <ArrowLeft />
              Back
            </Button>
          </div>
        )
      ) : (
        <>
          <div className="sticky right-0 top-[41px] flex justify-end border-b border-zinc-300 bg-background/90 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <Button
              className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
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

function SolutionRow({ solution }: { solution: ChallengeRouteData['sharedSolution'][number] }) {
  return (
    <div className="group flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-zinc-700/50">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{solution.title}</h3>
        <div className="text-sm text-neutral-500">{getRelativeTime(solution.createdAt)}</div>
      </div>
      <div className="flex gap-3 text-neutral-600 duration-300 dark:text-neutral-400">
        <div className="my-auto mr-auto max-w-fit rounded-full bg-neutral-100 px-2 py-1 text-xs font-bold text-neutral-400 dark:bg-zinc-700 dark:text-neutral-400">
          @&nbsp;{solution.user?.name}
        </div>
        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-neutral-100 px-2 py-1 text-sm duration-300 hover:bg-neutral-200 dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <MessageCircle className="h-4 w-4 stroke-1" /> {solution._count.solutionComment}
        </button>
        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-emerald-600/10 px-2 py-1 text-sm text-emerald-600 duration-300 hover:bg-emerald-600/20 dark:bg-emerald-400/20 dark:text-emerald-400 dark:hover:bg-emerald-400/40">
          <ArrowUp className="h-4 w-4 stroke-1" /> {solution._count.vote}
        </button>
      </div>
    </div>
  );
}

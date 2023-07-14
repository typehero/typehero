'use client';
import { ArrowUp, MessageCircle, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import type { ChallengeSolutionsRouteData } from '~/app/challenge/[id]/solutions/page';
import { getRelativeTime } from '~/utils/relativeTime';
import { SolutionEditor } from './solution-editor';

interface Props {
  challenge: ChallengeSolutionsRouteData;
}
type View = 'editor' | 'list' | 'details';
export function Solutions({ challenge }: Props) {
  const [view, setView] = useState<View>('list');
  const loggedInUserHasSolution = challenge?.submission?.length;
  const session = useSession();

  return (
    <div className="relative h-full">
      {view === 'editor' && (
        <SolutionEditor challenge={challenge} dismiss={() => setView('list')} />
      )}

      {view === 'list' && (
        <>
          <div className="sticky right-0 top-[41px] flex justify-end border-b border-zinc-300 bg-background/90 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <Button
              className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
              onClick={() => setView('editor')}
              disabled={!loggedInUserHasSolution || !session?.data?.user}
            >
              <Plus className="mr-2 h-4 w-4" /> Solution
            </Button>
          </div>
          {challenge?.sharedSolution.map((solution) => (
            <SolutionRow
              key={solution.id}
              solution={solution}
              handleClick={() => {
                setView('details');
              }}
            />
          ))}
        </>
      )}

      {view === 'details' && <div>show some details</div>}
    </div>
  );
}

function SolutionRow({
  solution,
}: {
  handleClick: (id: string) => void;
  solution: ChallengeSolutionsRouteData['sharedSolution'][0];
}) {
  return (
    <Link href={`/challenge/${solution.challengeId}/solutions/${solution.id}`}>
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
    </Link>
  );
}

'use client';
import { ArrowUp, MessageCircle } from '@repo/ui/icons';
import { useSession } from '@repo/auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@repo/ui';
import { SolutionEditor } from './solution-editor';
import NoSolutions from './nosolutions';
import SubmitSolution from './submit-solution';
import type { ChallengeSolutionsRouteData } from '~/app/challenge/[id]/solutions/page';
import { getRelativeTime } from '~/utils/relativeTime';

interface Props {
  challenge: ChallengeSolutionsRouteData;
}
type View = 'details' | 'editor' | 'list';
export function Solutions({ challenge }: Props) {
  const [view, setView] = useState<View>('list');
  const loggedInUserHasSolution = challenge.submission.length;
  const session = useSession();

  return (
    <div className="relative h-full">
      {view === 'editor' && (
        <SolutionEditor challenge={challenge} dismiss={() => setView('list')} />
      )}

      {view === 'list' && (
        <>
          {challenge.sharedSolution.length !== 0 ? (
            <>
              <div className="bg-background/70 dark:bg-muted/70 absolute right-0 top-0 flex w-full justify-end border-b border-zinc-300 p-2 backdrop-blur-sm dark:border-zinc-700">
                <SubmitSolution disabled={Boolean(!loggedInUserHasSolution)} setView={setView} />
              </div>
              <div className="custom-scrollable-element h-full overflow-y-auto pt-12">
                {challenge.sharedSolution.map((solution) => (
                  <SolutionRow
                    handleClick={() => {
                      setView('details');
                    }}
                    key={solution.id}
                    solution={solution}
                  />
                ))}
              </div>
            </>
          ) : (
            <NoSolutions
              loggedInUser={Boolean(session.data?.user)}
              loggedInUserHasSolution={loggedInUserHasSolution > 0}
              setView={setView}
            />
          )}
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
    <Link
      className="group flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:hover:bg-zinc-700/50"
      href={`/challenge/${solution.challengeId}/solutions/${solution.id}`}
    >
      <h3 className="truncate font-bold">{solution.title}</h3>
      <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
        <Button
          className="-ml-[0.33rem] flex h-auto w-fit items-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
          size="sm"
        >
          @{solution.user?.name ?? ''}
        </Button>
        <div className="mr-auto text-sm text-neutral-500">
          {getRelativeTime(solution.createdAt)}
        </div>
        <button className="mr-2 flex cursor-pointer items-center gap-2 rounded-full bg-neutral-100 px-2 py-1 text-sm  duration-300 hover:bg-neutral-200 dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <MessageCircle className="h-4 w-4 stroke-1" /> {solution._count.solutionComment}
        </button>
        {/* TODO: voted state */}
        {/* bg-emerald-600/10 text-emerald-600 duration-300 hover:bg-emerald-600/20 dark:bg-emerald-400/20 dark:text-emerald-400 dark:hover:bg-emerald-400/40*/}
        <button className="flex cursor-pointer items-center gap-2 rounded-full bg-neutral-100 px-2 py-1 text-sm duration-300 hover:bg-neutral-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 ">
          <ArrowUp className="h-4 w-4 stroke-1" /> {solution._count.vote}
        </button>
      </div>
    </Link>
  );
}

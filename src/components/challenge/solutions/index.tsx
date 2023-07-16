'use client';
import { ArrowUp, MessageCircle } from 'lucide-react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import type { ChallengeSolutionsRouteData } from '~/app/challenge/[id]/solutions/page';
import { getRelativeTime } from '~/utils/relativeTime';
import { SolutionEditor } from './solution-editor';
import { UserBadge } from '~/components/ui/user-badge';
import NoSolutions from './nosolutions';
import SubmitSolution from './submit-solution';

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
          {challenge.sharedSolution.length !== 0 ? (
            <>
              {(loggedInUserHasSolution || !session?.data?.user) && (
                <div className="sticky right-0 top-[41px] flex justify-end border-b border-zinc-300 bg-background/90 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
                  <SubmitSolution setView={setView} />
                </div>
              )}
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
          ) : (
            <NoSolutions
              setView={setView}
              loggedInUser={session?.data?.user ? true : false}
              loggedInUserHasSolution={loggedInUserHasSolution > 0 ? true : false}
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
      <h3 className="font-bold">{solution.title}</h3>
      <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
        <UserBadge username={solution.user?.name ?? ''} />
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

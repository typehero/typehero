'use client';
import { Calendar, MessageCircle, ThumbsUp } from '@repo/ui/icons';
import { useSession } from '@repo/auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { SolutionEditor } from './solution-editor';
import { NoSolutions } from './nosolutions';
import { SubmitSolution } from './submit-solution';
import type { ChallengeSolution } from '../getSolutionRouteData';
import { getRelativeTime } from '~/utils/relativeTime';
import { Badge } from '@repo/ui/components/badge';
import { UserBadge } from '@repo/ui/components/user-badge';

interface Props {
  challenge: ChallengeSolution;
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
                  <SolutionRow key={solution.id} solution={solution} />
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
    </div>
  );
}

function SolutionRow({ solution }: { solution: ChallengeSolution['sharedSolution'][0] }) {
  return (
    <Link
      className="flex cursor-pointer flex-col gap-2 p-4 duration-300 hover:bg-neutral-100 dark:hover:bg-zinc-700/50"
      href={`/challenge/${solution.challengeId}/solutions/${solution.id}`}
    >
      <h3 className="truncate font-bold">{solution.title}</h3>
      <div className="flex items-center gap-2">
        <UserBadge username={solution.user?.name ?? ''} linkComponent={Link} />
        <div className="text-muted-foreground flex flex-1 items-center gap-2">
          <Calendar className=" h-4 w-4" />
          <span className="text-xs">{getRelativeTime(solution.createdAt)}</span>
        </div>
        {solution.isPinned ? (
          <Badge className="dark:bg-difficulty-beginner-dark bg-difficulty-beginner text-white duration-300 dark:text-black">
            Pinned
          </Badge>
        ) : null}
        <Badge variant="secondary" size="xs" className="gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{solution._count.vote}</span>
        </Badge>
        <Badge variant="secondary" size="xs" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{solution._count.solutionComment}</span>
        </Badge>
      </div>
    </Link>
  );
}

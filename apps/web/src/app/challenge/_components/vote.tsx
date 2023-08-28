'use client';

import { useSession } from '@repo/auth/react';
import type { VoteType } from '@repo/db/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui';
import { ThumbsUp } from '@repo/ui/icons';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { incrementOrDecrementUpvote } from '../increment.action';

interface VoteProps {
  voteCount: number;
  initialHasVoted?: boolean;
  rootId: number;
  rootType: VoteType;
  disabled?: boolean;
  onVote?: (didUpvote: boolean) => void;
}

export function Vote({
  voteCount,
  initialHasVoted,
  rootId,
  rootType,
  disabled,
  onVote,
}: VoteProps) {
  const [votes, setVotes] = useState(voteCount);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const session = useSession();

  const debouncedIncrement = useRef(
    debounce(async (shouldIncrement: boolean) => {
      await incrementOrDecrementUpvote(rootId, rootType, shouldIncrement);
    }, 500),
  ).current;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="group flex h-6 items-center gap-1 rounded-full bg-zinc-200 pl-[0.675rem] pr-2 text-sm focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:bg-zinc-700 disabled:dark:bg-zinc-700/50"
          disabled={disabled}
          onClick={() => {
            let shouldIncrement = false;
            const previousVotes = votes;

            if (hasVoted) {
              setVotes((v) => v - 1);
              shouldIncrement = false;
              setHasVoted(false);
            } else {
              setVotes((v) => v + 1);
              shouldIncrement = true;
              setHasVoted(true);
            }

            if (onVote) {
              onVote(shouldIncrement);
            }

            debouncedIncrement(shouldIncrement)?.catch((e) => {
              setVotes(previousVotes);
              console.error(e);
            });
          }}
        >
          <ThumbsUp
            className={clsx(
              {
                'fill-emerald-600 stroke-emerald-600 group-hover:stroke-emerald-600 dark:fill-emerald-400 dark:stroke-emerald-400 group-hover:dark:stroke-emerald-400':
                  hasVoted,
                'stroke-zinc-500 group-hover:stroke-zinc-600 group-disabled:stroke-zinc-300 dark:stroke-zinc-300 group-hover:dark:stroke-zinc-100 group-disabled:dark:stroke-zinc-500/50':
                  !hasVoted,
              },
              'h-4 w-4 duration-200',
            )}
          />
          <span
            className={clsx(
              {
                'text-emerald-600 dark:text-emerald-400': hasVoted,
                'text-zinc-500 group-hover:text-zinc-600 group-disabled:text-zinc-300 dark:text-zinc-300 group-hover:dark:text-zinc-100 group-disabled:dark:text-zinc-500/50':
                  !hasVoted,
              },
              'my-auto w-4 self-end duration-300',
            )}
          >
            {votes}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{session.data?.user.id ? 'Upvote' : 'Login to Upvote'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

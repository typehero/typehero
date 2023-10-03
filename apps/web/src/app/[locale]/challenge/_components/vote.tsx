'use client';

import { useSession } from '@repo/auth/react';
import type { VoteType } from '@repo/db/types';
import { ThumbsUp } from '@repo/ui/icons';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { incrementOrDecrementUpvote } from '../increment.action';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { Button } from '@repo/ui/components/button';

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
        <Button
          className={clsx(
            'gap-2 border border-transparent [&:not(:disabled)]:hover:border-emerald-600  [&:not(:disabled)]:hover:text-emerald-600',
            {
              'border-emerald-600 text-emerald-600': hasVoted,
            },
          )}
          variant="secondary"
          size="xs"
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
          <ThumbsUp className="h-4 w-4" />
          <span className="font-bold">{votes}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{session.data?.user.id ? 'Upvote' : 'Login to Upvote'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

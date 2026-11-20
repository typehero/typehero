'use client';

import { useSession } from '@repo/auth/react';
import type { VoteType } from '@repo/db/types';
import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { ThumbsUp } from '@repo/ui/icons';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { useTRPC } from '~/trpc/react';

interface VoteProps {
  voteCount: number;
  initialHasVoted?: boolean;
  rootId: number;
  rootType: Exclude<VoteType, 'SUBMISSION'>;
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
  const trpc = useTRPC();
  const { mutateAsync: addOrRemoveVote } = useMutation(trpc.vote.addOrRemove.mutationOptions());

  // Tracks the in-flight request and the most recently requested state, so a newer
  // click can't race an earlier, still-pending request.
  const requestStateRef = useRef<{ running: boolean; desired: boolean | null }>({
    running: false,
    desired: null,
  });
  // The state the user last clicked into. Unlike `requestStateRef.desired` this is set on
  // click, before the debounce fires, so a failing request can tell a newer click exists.
  const latestIntentRef = useRef(Boolean(initialHasVoted));
  // The last vote state the server confirmed, which is what a failed request falls back to.
  const confirmedRef = useRef(Boolean(initialHasVoted));

  const debouncedVote = useRef(
    debounce((shouldVote: boolean) => {
      const state = requestStateRef.current;
      // Always remember the latest intent; if a request is already running, the
      // running loop picks this value up when it finishes.
      state.desired = shouldVote;
      if (state.running) return;
      state.running = true;

      void (async () => {
        try {
          while (state.desired !== null) {
            const next = state.desired;
            state.desired = null;
            try {
              await addOrRemoveVote({ rootType, rootId, shouldVote: next });
              confirmedRef.current = next;
            } catch (e) {
              console.error(e);
              // Only roll back if the user hasn't clicked again since; otherwise a
              // newer request is about to settle the state they now expect.
              if (latestIntentRef.current === next && confirmedRef.current !== next) {
                setHasVoted(confirmedRef.current);
                setVotes((v) => (next ? v - 1 : v + 1));
              }
            }
          }
        } finally {
          state.running = false;
        }
      })();
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
            const shouldVote = !hasVoted;

            latestIntentRef.current = shouldVote;
            setHasVoted(shouldVote);
            setVotes((v) => (shouldVote ? v + 1 : v - 1));

            if (onVote) {
              onVote(shouldVote);
            }

            debouncedVote(shouldVote);
          }}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-bold">{votes}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{session.data?.user?.id ? 'Upvote' : 'Login to Upvote'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

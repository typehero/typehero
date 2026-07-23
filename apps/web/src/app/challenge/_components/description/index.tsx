'use client';

import { useSession } from '@repo/auth/react';
import { cn } from '@repo/ui/cn';
import { ActionMenu } from '@repo/ui/components/action-menu';
import { Button, buttonVariants } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { DifficultyBadge } from '@repo/ui/components/difficulty-badge';
import { Markdown } from '@repo/ui/components/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { TypographyH3 } from '@repo/ui/components/typography/h3';
import { Bookmark as BookmarkIcon, Calendar, CheckCircle, Flag, Share } from '@repo/ui/icons';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { type ChallengeRouteData } from '~/app/challenge/[slug]/getChallengeRouteData';
import { ReportDialog } from '~/components/ReportDialog';
import { ShareUrl } from '~/components/share-url';
import { useTRPC } from '~/trpc/react';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import { UserBadge } from '../comments/enhanced-user-badge';
import { Vote } from '../vote';
import { Suggestions } from './suggestions';

interface DescriptionProps {
  challenge: ChallengeRouteData['challenge'];
}

export interface FormValues {
  comments: string;
  examples: boolean;
  derogatory: boolean;
  other: boolean;
}

export function Description({ challenge }: DescriptionProps) {
  const [hasBookmarked, setHasBookmarked] = useState(challenge.bookmark.length > 0);
  const session = useSession();
  const trpc = useTRPC();
  const bookmarkMutation = useMutation(trpc.bookmark.addOrRemove.mutationOptions());

  // Tracks the in-flight bookmark request and the most recently requested state
  // per challenge, so a newer click can't race an earlier, still-pending request.
  const bookmarkStateRef = useRef(new Map<number, { running: boolean; desired: boolean | null }>());

  const debouncedBookmark = useRef(
    debounce((challengeId: number, shouldBookmark: boolean) => {
      const state = bookmarkStateRef.current.get(challengeId) ?? { running: false, desired: null };
      // Always remember the latest intent; if a request is already running for
      // this challenge, the running loop will pick this value up when it finishes.
      state.desired = shouldBookmark;
      bookmarkStateRef.current.set(challengeId, state);
      if (state.running) return;
      state.running = true;

      void (async () => {
        try {
          while (state.desired !== null) {
            const next = state.desired;
            state.desired = null;
            try {
              await bookmarkMutation.mutateAsync({ challengeId, shouldBookmark: next });
              setHasBookmarked(next);
            } catch (e) {
              console.error(e);
              // it errored so reverse the intended changes
              setHasBookmarked(!next);
            }
          }
        } finally {
          state.running = false;
        }
      })();
    }, 500),
  ).current;

  return (
    <div
      // TODO: Fix this accessibility issue!
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="custom-scrollable-element h-full overflow-y-auto px-4 pb-36 pt-3 outline-none"
    >
      <div className="flex items-center">
        <TypographyH3 className="mr-auto max-w-[75%] items-center truncate text-2xl font-bold">
          {challenge.name}
        </TypographyH3>
        <ReportDialog challengeId={challenge.id} reportType="CHALLENGE">
          <ActionMenu
            items={[
              {
                key: 'feedback',
                label: 'Feedback',
                icon: Flag,
              },
            ]}
            onChange={() => {
              // do nothing
            }}
          />
        </ReportDialog>
      </div>
      {/* Author & Time */}
      <div className="mt-2 flex items-center gap-4">
        <UserBadge
          user={{
            name: challenge.user?.name ?? '',
            image: challenge.user?.image ?? '',
            bio: challenge.user?.bio ?? '',
            roles: challenge.user?.roles ?? [],
          }}
        />
        <div className="text-muted-foreground flex items-center gap-2">
          <Calendar className=" h-4 w-4" />
          <span className="text-xs">Last updated {getRelativeTimeStrict(challenge.updatedAt)}</span>
        </div>
      </div>
      {/* Difficulty & Action Buttons */}
      <div className="mt-3 flex items-center gap-3">
        <DifficultyBadge difficulty={challenge.difficulty} />
        {challenge.hasSolved ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <CheckCircle className="stroke-green-600 dark:stroke-green-300" size={20} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Solved</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
        <Vote
          voteCount={challenge._count.vote}
          initialHasVoted={challenge.vote.length > 0}
          disabled={!session?.data?.user?.id}
          rootType="CHALLENGE"
          rootId={challenge?.id}
          toUserId={challenge.user.id}
          challengeSlug={challenge.slug}
        />
        <Dialog>
          <DialogTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'xs' }),
                    'rounded-full',
                  )}
                >
                  <Share className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <ShareUrl isChallenge />
            </div>
          </DialogContent>
        </Dialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="xs"
              className={clsx(
                'border border-transparent [&:not(:disabled)]:hover:border-blue-500 [&:not(:disabled)]:hover:text-blue-500',
                {
                  'border-blue-500 text-blue-500': hasBookmarked,
                },
              )}
              disabled={!session.data?.user?.id}
              onClick={() => {
                let shouldBookmark = false;
                if (hasBookmarked) {
                  shouldBookmark = false;
                  setHasBookmarked(false);
                } else {
                  shouldBookmark = true;
                  setHasBookmarked(true);
                }
                debouncedBookmark(challenge.id, shouldBookmark);
              }}
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{session.data?.user?.id ? 'Bookmark' : 'Login to Bookmark'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {/* Challenge Description */}
      <div className="prose-invert prose-h3:text-xl mt-6 leading-7">
        <Markdown>{challenge.description}</Markdown>
      </div>
      {/* More Challenges Suggestions */}
      <Suggestions challengeId={challenge.id} />
    </div>
  );
}

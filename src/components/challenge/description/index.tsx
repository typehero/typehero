'use client';

import { clsx } from 'clsx';
import { debounce } from 'lodash';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Bookmark as BookmarkIcon, Share, ThumbsUp } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { UserBadge } from '~/components/ui/user-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { TypographyH3 } from '~/components/ui/typography/h3';
import { DifficultyBadge } from '~/components/ui/difficulty-badge';
import { ActionMenu } from '~/components/ui/action-menu';
import { Markdown } from '~/components/ui/markdown';
import { ShareForm } from '../share-form';

import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { addOrRemoveBookmark } from '../bookmark.action';
import { incrementOrDecrementUpvote } from '../increment.action';
import ReportDialog from '~/components/report';
import { getRelativeTime } from '~/utils/relativeTime';

interface Props {
  challenge: ChallengeRouteData;
}

export type FormValues = {
  comments: string;
  examples: boolean;
  derogatory: boolean;
  other: boolean;
};

export function Description({ challenge }: Props) {
  const router = useRouter();
  const [votes, setVotes] = useState(challenge._count.vote);
  const [hasVoted, setHasVoted] = useState(challenge.vote.length > 0);
  const [hasBookmarked, setHasBookmarked] = useState(challenge.bookmark.length > 0);
  const session = useSession();

  const debouncedSearch = useRef(
    debounce(async (challengeId: number, userId: string, shouldIncrement: boolean) => {
      const votes = await incrementOrDecrementUpvote(challengeId, userId, shouldIncrement);
      if (votes !== undefined && votes !== null) {
        setVotes(votes);
      }

      router.refresh();
    }, 500),
  ).current;

  const debouncedBookmark = useRef(
    debounce(async (challengeId: number, userId: string, shouldBookmark: boolean) => {
      try {
        await addOrRemoveBookmark(challengeId, userId, shouldBookmark);
        setHasBookmarked(shouldBookmark);
      } catch (e) {
        console.error(e);
        // it errored so reverse the intended changes
        setHasBookmarked(!shouldBookmark);
      }
    }, 500),
  ).current;

  return (
    <div className="custom-scrollable-element h-full overflow-y-auto px-4 pb-36 pt-3">
      {/* NOTE: collapse this element */}
      <div className="flex items-center gap-4">
        <TypographyH3 className="mb-2 mr-auto max-w-[75%] items-center truncate text-2xl font-bold">
          {challenge.name}
        </TypographyH3>
        {/* TODO: split this mess into components, make buttons have bigger horizontal padding and decrease the gap value on container above */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="ghost"
                className="p-1"
                disabled={!session?.data?.user?.id}
                onClick={() => {
                  let shouldBookmark = false;
                  if (hasBookmarked) {
                    shouldBookmark = false;
                    setHasBookmarked(false);
                  } else {
                    shouldBookmark = true;
                    setHasBookmarked(true);
                  }
                  debouncedBookmark(
                    challenge.id,
                    session?.data?.user?.id as string,
                    shouldBookmark,
                  )?.catch((e) => {
                    console.error(e);
                  });
                }}
              >
                <BookmarkIcon
                  className={clsx(
                    {
                      'fill-blue-500 stroke-blue-500': hasBookmarked,
                      'stroke-zinc-500': !hasBookmarked,
                    },
                    'h-4 w-4 hover:stroke-zinc-400',
                  )}
                />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{session?.data?.user?.id ? 'Bookmark' : 'Login to Bookmark'}</p>
          </TooltipContent>
        </Tooltip>
        <Dialog>
          <DialogTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <Share className="h-4 w-4 stroke-zinc-500 hover:stroke-zinc-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Share challenge</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent className="w-[200px]">
            <DialogHeader>
              <DialogTitle>Share this challenge</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <ShareForm />
            </div>
          </DialogContent>
        </Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                className="group gap-2 rounded-xl px-2 py-1"
                variant="ghost"
                disabled={!session?.data?.user?.id}
                onClick={() => {
                  let shouldIncrement = false;
                  if (hasVoted) {
                    setVotes((v) => v - 1);
                    shouldIncrement = false;
                    setHasVoted(false);
                  } else {
                    setVotes((v) => v + 1);
                    shouldIncrement = true;
                    setHasVoted(true);
                  }
                  debouncedSearch(
                    challenge.id,
                    session?.data?.user?.id as string,
                    shouldIncrement,
                  )?.catch((e) => {
                    console.error(e);
                  });
                }}
              >
                <ThumbsUp
                  className={clsx(
                    {
                      'fill-emerald-600 stroke-emerald-600 group-hover:stroke-emerald-400 dark:fill-emerald-400 dark:stroke-emerald-400':
                        hasVoted,
                      'stroke-zinc-500 group-hover:stroke-zinc-400': !hasVoted,
                    },
                    'h-4 w-4 duration-200 group-hover:scale-105 group-active:scale-95 group-active:duration-75',
                  )}
                />
                <span
                  className={clsx(
                    {
                      'text-emerald-600 dark:text-emerald-400': hasVoted,
                      'text-zinc-500 group-hover:text-zinc-400': !hasVoted,
                    },
                    'my-auto w-4 self-end duration-300',
                  )}
                >
                  {votes}
                </span>
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{session?.data?.user?.id ? 'Upvote' : 'Login to Upvote'}</p>
          </TooltipContent>
        </Tooltip>
        <ReportDialog reportType="CHALLENGE" challengeId={challenge.id}>
          <ActionMenu
            items={[
              {
                key: 'feedback',
                label: 'Feedback',
                icon: 'Flag',
              },
            ]}
            onChange={() => {
              // do nothing
            }}
          />
        </ReportDialog>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <UserBadge username={challenge.user.name} />
        <span className="-ml-1 text-xs text-muted-foreground">
          {getRelativeTime(challenge.updatedAt)}
        </span>
      </div>
      <div className="prose-invert leading-8 prose-h3:text-xl">
        <Markdown>{challenge.description}</Markdown>
      </div>
    </div>
  );
}

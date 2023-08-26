'use client';

import { useSession } from '@repo/auth/react';
import {
  ActionMenu,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DifficultyBadge,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TypographyH3,
  UserBadge,
} from '@repo/ui';
import { Bookmark as BookmarkIcon, Flag, Share } from '@repo/ui/icons';
import { clsx } from 'clsx';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { ReportDialog } from '~/components/ReportDialog';
import { Markdown } from '~/components/ui/markdown';
import { getRelativeTime } from '~/utils/relativeTime';
import { addOrRemoveBookmark } from '../bookmark.action';
import { ShareForm } from '../share-form';
import { Vote } from '../vote';

interface Props {
  challenge: ChallengeRouteData;
}

export interface FormValues {
  comments: string;
  examples: boolean;
  derogatory: boolean;
  other: boolean;
}

export function Description({ challenge }: Props) {
  const [hasBookmarked, setHasBookmarked] = useState(challenge.bookmark.length > 0);
  const session = useSession();

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
      <div className="flex items-center gap-3">
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
        <UserBadge username={challenge.user.name} linkComponent={Link} />
        <span className="text-muted-foreground -ml-1 text-xs">
          {getRelativeTime(challenge.updatedAt)}
        </span>
      </div>
      {/* Difficulty & Action Buttons */}
      <div className="mt-3 flex items-center gap-3">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <Dialog>
          <DialogTrigger>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="group flex h-6 items-center rounded-full bg-zinc-200 px-3 dark:bg-zinc-700">
                  <Share className="h-4 w-4 stroke-zinc-500 group-hover:stroke-zinc-600 dark:stroke-zinc-300 group-hover:dark:stroke-zinc-100" />
                </button>
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
            <button
              className="group flex h-6 items-center rounded-full bg-zinc-200 px-3 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:bg-zinc-700 disabled:dark:bg-zinc-700/50"
              disabled={!session.data?.user.id}
              onClick={() => {
                let shouldBookmark = false;
                if (hasBookmarked) {
                  shouldBookmark = false;
                  setHasBookmarked(false);
                } else {
                  shouldBookmark = true;
                  setHasBookmarked(true);
                }
                debouncedBookmark(challenge.id, session.data?.user.id!, shouldBookmark)?.catch(
                  (e) => {
                    console.error(e);
                  },
                );
              }}
            >
              <BookmarkIcon
                className={clsx(
                  {
                    'fill-blue-500 stroke-blue-500': hasBookmarked,
                    'stroke-zinc-500 group-hover:stroke-zinc-600 group-disabled:stroke-zinc-300 dark:stroke-zinc-300 group-hover:dark:stroke-zinc-100 group-disabled:dark:stroke-zinc-500/50':
                      !hasBookmarked,
                  },
                  'h-4 w-4',
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{session.data?.user.id ? 'Bookmark' : 'Login to Bookmark'}</p>
          </TooltipContent>
        </Tooltip>
        <Vote
          voteCount={challenge._count.vote}
          initialHasVoted={challenge.vote.length > 0}
          disabled={!session?.data?.user?.id}
          rootType="CHALLENGE"
          rootId={challenge?.id}
        />
      </div>
      {/* Challenge Description */}
      <div className="prose-invert prose-h3:text-xl mt-6 leading-8">
        <Markdown>{challenge.description}</Markdown>
      </div>
    </div>
  );
}

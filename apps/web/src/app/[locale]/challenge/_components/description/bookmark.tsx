'use client';
import { Button } from '@repo/ui/components/button';
import clsx from 'clsx';
import { debounce } from 'lodash';
import React, { useRef, useState } from 'react';
import { addOrRemoveBookmark } from '../bookmark.action';
import { useSession } from '@repo/auth/react';
import { Bookmark as BookmarkIcon } from '@repo/ui/icons';
import type { ChallengeProps } from '.';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';

interface BookmarkProps extends ChallengeProps {
  session: ReturnType<typeof useSession>;
}

export function BookmarkTooltip({ challenge }: ChallengeProps) {
  const session = useSession();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Bookmark challenge={challenge} session={session} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{session.data?.user.id ? 'Bookmark' : 'Login to Bookmark'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function Bookmark({ challenge, session }: BookmarkProps) {
  const [hasBookmarked, setHasBookmarked] = useState(challenge.bookmark.length > 0);

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
    <Button
      variant="secondary"
      size="xs"
      className={clsx(
        'border border-transparent [&:not(:disabled)]:hover:border-blue-500 [&:not(:disabled)]:hover:text-blue-500',
        {
          'border-blue-500 text-blue-500': hasBookmarked,
        },
      )}
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
        debouncedBookmark(challenge.id, session.data?.user.id!, shouldBookmark)?.catch((e) => {
          console.error(e);
        });
      }}
    >
      <BookmarkIcon className="h-4 w-4" />
    </Button>
  );
}

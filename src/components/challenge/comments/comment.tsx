'use client';

import clsx from 'clsx';
import { Pencil, Reply, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { z } from 'zod';
import type { ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import ReportDialog from '~/components/report';
import { Markdown } from '~/components/ui/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { toast } from '~/components/ui/use-toast';
import { UserBadge } from '~/components/ui/user-badge';
import { getRelativeTime } from '~/utils/relativeTime';
import { CommentDeleteDialog } from './delete';

interface CommentProps {
  comment: ChallengeRouteData['comment'][number];
  readonly?: boolean;
}

const commentReportSchema = z
  .object({
    spam: z.boolean().optional(),
    threat: z.boolean().optional(),
    hate_speech: z.boolean().optional(),
    bullying: z.boolean().optional(),
    text: z.string().optional(),
  })
  .refine(
    (obj) => {
      const { spam, threat, hate_speech, bullying, text } = obj;
      return spam || threat || hate_speech || bullying || (text !== undefined && text !== '');
    },
    {
      path: ['text'],
      message: 'Your report should include an issue or a reason.',
    },
  );

export type CommentReportSchemaType = z.infer<typeof commentReportSchema>;

const Comment = ({ comment, readonly = false }: CommentProps) => {
  const isTooManyLines = comment.text.split('\n').length > 15;
  const [showReadMore, setShowReadMore] = useState(isTooManyLines); // take some default value from the calculation of characters
  async function copyPathNotifyUser() {
    try {
      await copyCommentUrlToClipboard();
      toast({
        title: 'Success!',
        variant: 'success',
        description: <p>Copied comment URL to clipboard!</p>,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failure!',
        variant: 'destructive',
        description: <p>Something went wrong!</p>,
      });
    }
  }

  async function copyCommentUrlToClipboard() {
    await navigator.clipboard.writeText(`${window.location.href}/comment/${comment.id}`);
  }

  const loggedinUser = useSession();

  const isAuthor = loggedinUser.data?.user?.id === comment.user.id;

  return (
    <div className="flex flex-col gap-1 p-3 pt-2">
      <div className="flex items-start justify-between pr-[0.4rem]">
        <div className="flex items-center gap-1">
          <UserBadge username={comment.user.name ?? ''} />
        </div>
        <div className="flex items-center gap-1">
          <Tooltip delayDuration={0.05}>
            <TooltipTrigger asChild>
              <span className="mr-2 whitespace-nowrap text-sm text-neutral-500">
                {getRelativeTime(comment.createdAt)}
              </span>
            </TooltipTrigger>
            <TooltipContent align="start" className="rounded-xl" alignOffset={-55}>
              <span className="text-white-500 text-xs">{comment.createdAt.toLocaleString()}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <p
        className={clsx(
          { 'h-full': !showReadMore, 'max-h-[300px]': showReadMore },
          'relative w-full overflow-hidden break-words pl-[1px] text-sm',
        )}
      >
        <Markdown>{comment.text}</Markdown>
        {showReadMore && (
          <div
            className="absolute top-0 flex h-full w-full cursor-pointer items-end bg-gradient-to-b from-transparent to-white dark:to-zinc-800"
            onClick={() => setShowReadMore(false)}
          >
            <div className="text-md text-label-1 dark:text-dark-label-1 flex w-full items-center justify-center hover:bg-transparent">
              Read more
            </div>
          </div>
        )}
      </p>
      <>
        {!readonly && (
          <div className="flex items-center gap-4 py-4">
            <div
              onClick={() => {
                copyPathNotifyUser();
              }}
              className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
            >
              <Share size={16} />
              <div className="text-xs">Share</div>
            </div>
            {/* TODO: make dis work */}
            <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
              <Reply size={18} />
              <div className="text-xs">Reply</div>
            </button>
            {isAuthor && (
              <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
                <Pencil size={16} />
                <div className="text-xs">Edit</div>
              </button>
            )}
            {/* TODO: make dis work */}
            {isAuthor ? (
              <CommentDeleteDialog comment={comment} asChild>
                <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
                  <Trash2 size={16} />
                  <div className="text-xs">Delete</div>
                </button>
              </CommentDeleteDialog>
            ) : (
              <ReportDialog reportType="COMMENT" commentId={comment.id}>
                <button className="flex cursor-pointer items-center text-sm text-neutral-400 duration-200 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500">
                  Report
                </button>
              </ReportDialog>
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default Comment;

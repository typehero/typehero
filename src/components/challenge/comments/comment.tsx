'use client';

import clsx from 'clsx';
import { Pencil, Reply, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import type { ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import ReportDialog from '~/components/report';
import { Markdown } from '~/components/ui/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { toast } from '~/components/ui/use-toast';
import { UserBadge } from '~/components/ui/user-badge';
import { getRelativeTime } from '~/utils/relativeTime';
import { CommentDeleteDialog } from './delete';
import { CommentInput } from './comment-input';
import { updateComment } from './comment.action';
import { useQueryClient } from '@tanstack/react-query';

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

export const Comment = ({ comment, readonly = false }: CommentProps) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

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
  const handleEnterKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      await updateChallengeComment();
    }
  };

  async function updateChallengeComment() {
    try {
      const res = await updateComment(text, comment.id);
      if (res === 'text_is_empty') {
        toast({
          title: 'Empty Comment',
          description: <p>You cannot post an empty comment.</p>,
        });
      } else if (res === 'unauthorized') {
        toast({
          title: 'Unauthorized',
          description: <p>You need to be signed in to post a comment.</p>,
        });
      }
      queryClient.invalidateQueries([`challenge-${comment.rootChallengeId}-comments`]);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
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
      <div className="flex items-start justify-between gap-4 pr-[0.4rem]">
        <div className="flex items-center gap-1">
          <UserBadge username={comment.user.name ?? ''} />
          <Tooltip delayDuration={0.05}>
            <TooltipTrigger asChild>
              <span className="whitespace-nowrap text-[0.8rem] text-neutral-500 dark:text-neutral-400">
                {getRelativeTime(comment.createdAt)}
              </span>
            </TooltipTrigger>
            <TooltipContent align="start" className="rounded-xl" alignOffset={-55}>
              <span className="text-xs text-white">{comment.createdAt.toLocaleString()}</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="to-200% my-auto h-[1px] w-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="my-auto flex items-center gap-4">
          {!readonly && (
            <>
              <div
                onClick={() => {
                  copyPathNotifyUser();
                }}
                className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Share className="h-3 w-3" />
                <div className="hidden text-[0.8rem] sm:block">Share</div>
              </div>
              {/* TODO: make dis work */}
              <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
                <Reply className="h-4 w-4" />
                <div className="hidden text-[0.8rem] sm:block">Reply</div>
              </button>
              {isAuthor && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  <Pencil className="h-3 w-3" />
                  <div className="hidden text-[0.8rem] sm:block">Edit</div>
                </button>
              )}
              {/* TODO: make dis work */}
              {isAuthor ? (
                <CommentDeleteDialog comment={comment} asChild>
                  <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
                    <Trash2 className="h-3 w-3" />
                    <div className="hidden text-[0.8rem] sm:block">Delete</div>
                  </button>
                </CommentDeleteDialog>
              ) : (
                <ReportDialog reportType="COMMENT" commentId={comment.id}>
                  <button className="flex cursor-pointer items-center text-[0.8rem] text-neutral-400 duration-200 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500">
                    Report
                  </button>
                </ReportDialog>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {!isEditing && <ExpandableContent content={comment.text} />}
        {isEditing && (
          <div className="my-2">
            <CommentInput
              value={text}
              onCancel={() => {
                setIsEditing(false);
              }}
              onChange={setText}
              onKeyDown={handleEnterKey}
              onSubmit={async () => {
                await updateChallengeComment();
                setIsEditing(false);
              }}
              mode="edit"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ExpandableContent = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(true);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if ((contentWrapperRef.current?.clientHeight ?? 0) > 300) {
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [content]);

  return (
    <div
      className={clsx(
        { 'h-full': expanded, 'max-h-[300px]': !expanded },
        'relative w-full overflow-hidden break-words pl-[1px] text-sm',
      )}
      ref={contentWrapperRef}
    >
      <Markdown>{content}</Markdown>
      {!expanded && (
        <div
          className="absolute top-0 flex h-full w-full cursor-pointer items-end bg-gradient-to-b from-transparent to-white dark:to-zinc-800"
          onClick={() => setExpanded(true)}
        >
          <div className="text-md text-label-1 dark:text-dark-label-1 flex w-full items-center justify-center hover:bg-transparent">
            Read more
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import { useSession } from '@repo/auth/react';
import { type CommentRoot } from '@repo/db/types';
import { Tooltip, TooltipContent, TooltipTrigger, UserBadge, toast } from '@repo/ui';
import { ChevronDown, ChevronUp, Pencil, Reply, Share, ThumbsUp, Trash2 } from '@repo/ui/icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { debounce } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { ReportDialog } from '~/components/ReportDialog';
import { Markdown } from '~/components/ui/markdown';
import { getRelativeTime } from '~/utils/relativeTime';
import { incrementOrDecrementUpvote } from '../../increment.action';
import { CommentInput } from './comment-input';
import { replyComment, updateComment, type CommentsByChallengeId } from './comment.action';
import { CommentDeleteDialog } from './delete';
import { getPaginatedComments } from './getCommentRouteData';

interface SingleCommentProps {
  comment: CommentsByChallengeId[number];
  readonly?: boolean;
  isReply?: boolean;
  onClickReply?: () => void;
  queryKey?: (number | string)[];
  replyQueryKey?: (number | string)[];
}

type CommentProps = SingleCommentProps & {
  rootId: number;
  type: CommentRoot;
};

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

export function Comment({ comment, readonly = false, rootId, type, queryKey }: CommentProps) {
  const [showReplies, setShowReplies] = useState(false);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();
  const session = useSession();

  const replyQueryKey = [`${comment.id}-comment-replies`];
  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: replyQueryKey,
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedComments({
        rootId,
        rootType: type,
        page: pageParam,
        parentId: comment.id,
      }),
    getNextPageParam: (_, pages) => pages.length + 1,
    staleTime: 5000,
  });

  async function createChallengeCommentReply() {
    try {
      const res = await replyComment(
        {
          text: replyText,
          rootId,
          rootType: type,
        },
        comment.id,
      );
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
      setReplyText('');
      queryClient.invalidateQueries(replyQueryKey);
      queryClient.invalidateQueries(queryKey);
      setShowReplies(true);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    }
  }

  const toggleReplies = () => setShowReplies(!showReplies);
  const toggleIsReplying = () => setIsReplying(!isReplying);

  return (
    <div className="flex flex-col px-2 py-1">
      <SingleComment comment={comment} onClickReply={toggleIsReplying} readonly={readonly} />
      {comment._count.replies > 0 && (
        <button
          className="z-50 ml-2 mt-1 flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
          onClick={toggleReplies}
        >
          {showReplies ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}

          <div className="text-xs">
            {comment._count.replies === 1 ? '1 reply' : `${comment._count.replies} replies`}
          </div>
        </button>
      )}

      {isReplying ? (
        <div className="relative mt-2 pb-2 pl-8">
          <Reply className="absolute left-2 top-2 h-4 w-4 opacity-50" />
          <CommentInput
            mode="edit"
            onCancel={() => {
              setIsReplying(false);
            }}
            onChange={setReplyText}
            onSubmit={async () => {
              await createChallengeCommentReply();
              setIsReplying(false);
            }}
            value={replyText}
          />
        </div>
      ) : null}

      {showReplies ? (
        <div className="-mt-1 flex flex-col gap-1 p-2 pb-8 pl-8 pr-0">
          {data?.pages.flatMap((page) =>
            page.comments.map((reply) => (
              // this is a reply
              <SingleComment comment={reply} isReply key={reply.id} replyQueryKey={replyQueryKey} />
            )),
          )}
        </div>
      ) : null}

      {!isFetching && showReplies && data?.pages.at(-1)?.hasMore ? (
        <button
          className="flex cursor-pointer items-center gap-1 pl-6 text-xs text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
          onClick={() => fetchNextPage()}
        >
          Load more
        </button>
      ) : null}
    </div>
  );
}

function SingleComment({
  comment,
  readonly = false,
  onClickReply,
  isReply,
  queryKey,
  replyQueryKey,
}: SingleCommentProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const [votes, setVotes] = useState(comment._count.vote);
  const [hasVoted, setHasVoted] = useState(comment.vote.length > 0);
  const session = useSession();

  const debouncedVote = useRef(
    debounce(async (commentId: number, shouldIncrement: boolean) => {
      const votes = await incrementOrDecrementUpvote(commentId, 'COMMENT', shouldIncrement);
      if (votes !== undefined && votes !== null) {
        setVotes(votes);
      }
    }, 500),
  ).current;

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
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(replyQueryKey);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    }
  }

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

  const isAuthor = loggedinUser.data?.user.id === comment.user.id;

  return (
    <div className="relative rounded-xl bg-zinc-200 p-2 pl-3 dark:bg-zinc-600/30">
      <div className="flex items-start justify-between gap-4 pr-[0.4rem]">
        <div className="flex items-center gap-1">
          <UserBadge username={comment.user.name ?? ''} linkComponent={Link} />
          <Tooltip delayDuration={0.05}>
            <TooltipTrigger asChild>
              <span className="whitespace-nowrap text-[0.8rem] text-neutral-500 dark:text-neutral-400">
                {getRelativeTime(comment.createdAt)}
              </span>
            </TooltipTrigger>
            <TooltipContent align="start" alignOffset={-55} className="rounded-xl">
              <span className="text-xs text-white">{comment.createdAt.toLocaleString()}</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="my-auto flex items-center gap-4">
          {!readonly && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="group flex h-6 items-center gap-1 rounded-full bg-zinc-200 pl-[0.675rem] pr-2 text-sm disabled:cursor-not-allowed disabled:bg-zinc-100 dark:bg-zinc-700 disabled:dark:bg-zinc-700/50"
                    disabled={!session.data?.user.id || comment.userId === session.data.user.id}
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
                      debouncedVote(comment.id, shouldIncrement)?.catch((e) => {
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
              <Reply className="absolute -left-6 h-4 w-4 opacity-50" />
              <div
                className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
                onClick={() => {
                  copyPathNotifyUser();
                }}
              >
                <Share className="h-3 w-3" />
                <div className="hidden text-[0.8rem] sm:block">Share</div>
              </div>
              {!isReply && (
                <button
                  className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 disabled:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  onClick={onClickReply}
                >
                  <Reply className="h-4 w-4" />
                  <div className="hidden text-[0.8rem] sm:block">Reply</div>
                </button>
              )}
              {isAuthor ? (
                <button
                  className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Pencil className="h-3 w-3" />
                  <div className="hidden text-[0.8rem] sm:block">Edit</div>
                </button>
              ) : null}
              {isAuthor ? (
                <CommentDeleteDialog asChild comment={comment}>
                  <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
                    <Trash2 className="h-3 w-3" />
                    <div className="hidden text-[0.8rem] sm:block">Delete</div>
                  </button>
                </CommentDeleteDialog>
              ) : (
                <ReportDialog commentId={comment.id} reportType="COMMENT">
                  <div className="flex cursor-pointer items-center text-[0.8rem] text-neutral-400 duration-200 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500">
                    Report
                  </div>
                </ReportDialog>
              )}
            </>
          )}
        </div>
      </div>
      {!isEditing && (
        <div className="-mb-1">
          <ExpandableContent content={comment.text} />
        </div>
      )}
      {isEditing ? (
        <div className="-mx-2 -mb-2">
          <CommentInput
            mode="edit"
            onCancel={() => {
              setIsEditing(false);
            }}
            onChange={setText}
            onSubmit={async () => {
              await updateChallengeComment();
              setIsEditing(false);
            }}
            value={text}
          />
        </div>
      ) : null}
    </div>
  );
}

function ExpandableContent({ content }: { content: string }) {
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
}

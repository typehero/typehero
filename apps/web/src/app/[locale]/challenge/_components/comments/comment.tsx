'use client';

import { useSession } from '@repo/auth/react';
import { type CommentRoot } from '@repo/db/types';
import { Markdown } from '@repo/ui/components/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { toast } from '@repo/ui/components/use-toast';
import { UserBadge } from '@repo/ui/components/user-badge';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Flag,
  Pencil,
  Reply,
  Share,
  Trash2,
  MoreHorizontal,
} from '@repo/ui/icons';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { ReportDialog } from '~/components/ReportDialog';
import { getRelativeTime } from '~/utils/relativeTime';
import { Vote } from '../vote';
import { CommentInput } from './comment-input';
import { replyComment, updateComment } from './comment.action';
import { CommentDeleteDialog } from './delete';
import {
  getAllComments,
  type PaginatedComments,
  type PreselectedCommentMetadata,
} from './getCommentRouteData';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { CommentSkeleton } from './comment-skeleton';
import { isAdminOrModerator } from '~/utils/auth-guards';

interface SingleCommentProps {
  comment: PaginatedComments['comments'][number];
  readonly?: boolean;
  isReply?: boolean;
  isToggleReply?: boolean;
  onClickReply?: () => void;
  onClickToggleReply?: () => void;
  queryKey?: (number | string)[];
  replyQueryKey?: (number | string)[];
  preselectedCommentMetadata?: PreselectedCommentMetadata;
}

type CommentProps = SingleCommentProps & {
  preselectedCommentMetadata?: PreselectedCommentMetadata;
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

const REPLIES_PAGESIZE = 5;

// million-ignore
export function Comment({
  comment,
  preselectedCommentMetadata,
  readonly = false,
  rootId,
  type,
  queryKey,
}: CommentProps) {
  const params = useSearchParams();
  const replyId = params.get('replyId');

  const hasPreselectedReply =
    preselectedCommentMetadata?.selectedComment?.id === comment.id && Boolean(replyId);

  const [showReplies, setShowReplies] = useState(hasPreselectedReply);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const replyQueryKey = [`comment-${comment.id}-replies`];

  const {
    data: replies,
    fetchStatus,
    isPending: isLoadingReplies,
  } = useQuery({
    queryKey: replyQueryKey,
    queryFn: () => getAllComments({ rootId, rootType: type, parentId: comment.id }),
    staleTime: 5000,
    enabled: showReplies,
  });

  const {
    data: paginatedReplies,
    fetchNextPage,
    isFetching: isFetchingMoreReplies,
    hasNextPage: hasMoreReplies,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [...replyQueryKey, 'paginated'],
    queryFn: ({ pageParam }) => {
      // `cursor` is the start index of the current page
      const cursor = Number(pageParam);

      let take = REPLIES_PAGESIZE;
      if (hasPreselectedReply && cursor === 0) {
        const preselectedReplyIndex = replies!.findIndex((reply) => Number(replyId) === reply.id);
        take = Math.ceil((preselectedReplyIndex + 1) / REPLIES_PAGESIZE) * REPLIES_PAGESIZE;
      }

      // `end` is exclusive, and therefore also the next cursor
      const end = cursor + take;

      return {
        // if the current page is the last, don't return the next cursor
        cursor: end < replies!.length ? end : undefined,
        replies: replies!.slice(cursor, end),
      };
    },
    enabled: Boolean(replies),
    getNextPageParam: (_, pages) => pages.at(-1)?.cursor,
  });

  useEffect(() => {
    if (replies) {
      refetch();
    }
  }, [replies, refetch]);

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
      queryClient.invalidateQueries({ queryKey: replyQueryKey });
      queryClient.invalidateQueries({ queryKey });
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
      <SingleComment
        preselectedCommentMetadata={preselectedCommentMetadata}
        comment={comment}
        isToggleReply={showReplies}
        onClickReply={toggleIsReplying}
        onClickToggleReply={toggleReplies}
        readonly={readonly}
      />
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

      {isLoadingReplies && fetchStatus !== 'idle' ? <CommentSkeleton /> : null}
      {showReplies ? (
        <>
          <div className="flex flex-col gap-1 pl-6 pt-1">
            {paginatedReplies?.pages.flatMap((page) =>
              page.replies.map((reply) => (
                // this is a reply
                <SingleComment
                  comment={reply}
                  isReply
                  key={reply.id}
                  replyQueryKey={replyQueryKey}
                  preselectedCommentMetadata={preselectedCommentMetadata}
                />
              )),
            )}
          </div>
          {hasMoreReplies && !isFetchingMoreReplies ? (
            <Button
              variant="ghost"
              className="gap-1 text-xs text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
              onClick={() => fetchNextPage()}
            >
              <MoreHorizontal size={24} />
              Load More
              <span className="sr-only">Load More</span>
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

const SELECTED_CLASSES = 'rounded-md bg-sky-300/20';

// million-ignore
function SingleComment({
  comment,
  isReply,
  isToggleReply,
  onClickReply,
  onClickToggleReply,
  queryKey,
  readonly = false,
  replyQueryKey,
  preselectedCommentMetadata,
}: SingleCommentProps) {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const replyId = searchParams.get('replyId');
  const queryClient = useQueryClient();
  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();

  const isHighlighted = replyId
    ? Number(replyId) === comment.id
    : preselectedCommentMetadata?.selectedComment?.id === comment.id;

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
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: replyQueryKey });
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    }
  }

  async function copyPathNotifyUser(isReply: boolean, slug: string) {
    try {
      await copyCommentUrlToClipboard(isReply, slug);
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

  async function copyCommentUrlToClipboard(isReply: boolean, slug: string) {
    const commentId = isReply ? comment.parentId : comment.id;
    const paramsObj = { replyId: String(comment.id) };
    const searchParams = new URLSearchParams(paramsObj);

    const { rootType, rootSolutionId } = comment;
    const baseURL = `${window.location.origin}/challenge/${slug}`;
    const hasGetParams = isReply ? `?${searchParams.toString()}` : '';

    const shareUrl =
      rootType === 'CHALLENGE'
        ? `${baseURL}/comments/${commentId}${hasGetParams}`
        : `${baseURL}/solutions/${rootSolutionId}/comments/${commentId}${hasGetParams}`;

    await navigator.clipboard.writeText(shareUrl);
  }

  const loggedinUser = useSession();

  const isAuthor = loggedinUser.data?.user.id === comment.user.id;
  const isAdminAndModerator = isAdminOrModerator(loggedinUser.data);

  const hasBeenEdited = comment.updatedAt.getTime() > comment.createdAt.getTime();

  useEffect(() => {
    if (!isHighlighted) return;
    const timeout = setTimeout(() => {
      elRef.current?.classList.remove(...SELECTED_CLASSES.split(' '));
    }, 5000);
    window.requestAnimationFrame(() => elRef.current?.scrollIntoView({ block: 'nearest' }));
    return () => {
      clearTimeout(timeout);
    };
  }, [isHighlighted]);

  return (
    <div
      id={`comment-${comment.id}`}
      className={clsx(
        'relative p-2 pl-3',
        isHighlighted && SELECTED_CLASSES,
        'transition-colors',
        'duration-150',
      )}
      ref={elRef}
    >
      <div className="flex items-start justify-between gap-4 pr-[0.4rem]">
        <div className="mb-2 flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage alt="github profile picture" src={comment.user?.image ?? ''} />
              <AvatarFallback className="border border-zinc-300 dark:border-zinc-600">
                {comment.user?.name.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <UserBadge username={comment.user.name ?? ''} linkComponent={Link} />
          </div>

          <Tooltip delayDuration={0.05}>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground flex items-center gap-2 whitespace-nowrap text-xs">
                <Calendar className="h-4 w-4" />
                <span>{getRelativeTime(comment.createdAt)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="start" alignOffset={-55} className="rounded-xl">
              <span className="text-foreground text-xs">{comment.createdAt.toLocaleString()}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {!isEditing && (
        <div className="-mb-1">
          <ExpandableContent content={comment.text} />
          {hasBeenEdited ? (
            <div className="text-muted-foreground flex items-center gap-2 whitespace-nowrap text-xs">
              Last edited at
              {new Intl.DateTimeFormat(undefined, {
                timeStyle: 'short',
                dateStyle: 'short',
              }).format(comment.updatedAt)}
            </div>
          ) : null}
        </div>
      )}
      {isEditing ? (
        <div className="mb-2">
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
      <div className="my-auto mt-3 flex items-center gap-2">
        {!readonly && (
          <>
            <Vote
              voteCount={comment._count.vote}
              initialHasVoted={comment.vote.length > 0}
              disabled={!session?.data?.user?.id || comment.userId === session?.data?.user?.id}
              rootType="COMMENT"
              rootId={comment.id}
              onVote={(didUpvote: boolean) => {
                comment.vote = didUpvote
                  ? [
                      {
                        userId: session?.data?.user?.id ?? '',
                      },
                    ]
                  : [];
                comment._count.vote += didUpvote ? 1 : -1;
              }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="xs"
                  className="gap-2"
                  onClick={() => {
                    copyPathNotifyUser(Boolean(isReply), slug as string);
                  }}
                >
                  <Share className="h-3 w-3" />
                  <span className="sr-only">Share this comment</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            {!isReply && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="xs" onClick={onClickReply}>
                    <Reply className="h-3 w-3" />
                    <span className="sr-only">Create a reply</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reply</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isAuthor ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="xs" onClick={() => setIsEditing(!isEditing)}>
                    <Pencil className="h-3 w-3" />
                    <span className="sr-only">Edit this comment</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
            {isAuthor || isAdminAndModerator ? (
              <Tooltip>
                <CommentDeleteDialog asChild comment={comment}>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="xs">
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete this comment</span>
                    </Button>
                  </TooltipTrigger>
                </CommentDeleteDialog>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <ReportDialog triggerAsChild commentId={comment.id} reportType="COMMENT">
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="xs">
                      <Flag className="h-3 w-3" />
                      <span className="sr-only">Report this comment</span>
                    </Button>
                  </TooltipTrigger>
                </ReportDialog>
                <TooltipContent>
                  <p>Report</p>
                </TooltipContent>
              </Tooltip>
            )}
            {comment._count.replies > 0 && (
              <Button
                variant="ghost"
                size="xs"
                className="z-50 ml-auto gap-1"
                onClick={onClickToggleReply}
              >
                {isToggleReply ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}

                <div className="text-xs">
                  {comment._count.replies === 1 ? '1 reply' : `${comment._count.replies} replies`}
                </div>
                <span className="sr-only">Toggle replies view</span>
              </Button>
            )}
          </>
        )}
      </div>
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

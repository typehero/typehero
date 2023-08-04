'use client';

import { type CommentRoot } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronDown, ChevronUp, Pencil, Reply, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import ReportDialog from '~/components/report';
import { Markdown } from '~/components/ui/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { toast } from '~/components/ui/use-toast';
import { UserBadge } from '~/components/ui/user-badge';
import { getRelativeTime } from '~/utils/relativeTime';
import { CommentInput } from './comment-input';
import { replyComment, updateComment } from './comment.action';
import { CommentDeleteDialog } from './delete';
import { getPaginatedComments, type PaginatedComments } from './getCommentRouteData';

interface SingleCommentProps {
  comment: PaginatedComments['comments'][number];
  readonly?: boolean;
  isReply?: boolean;
  onClickReply?: () => void;
  onDelete?: () => void;
}

type CommentProps = SingleCommentProps & {
  rootId: number;
  type: CommentRoot;
  onReply?: () => void;
  onDelete?: () => void;
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

const Comment = ({ comment, readonly = false, rootId, type, onReply, onDelete }: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [page, setPage] = useState(1);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState(comment.text);
  const queryClient = useQueryClient();

  const replyQueryKey = `${comment.id}-comment-replies`;
  const { status, data: replies } = useQuery({
    queryKey: [replyQueryKey, page],
    queryFn: () => getPaginatedComments({ rootId, rootType: type, page, parentId: comment.id }),
    keepPreviousData: true,
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
      queryClient.invalidateQueries([replyQueryKey, page]);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    } finally {
      if (onReply) {
        onReply();
      }
    }
  }

  const handleEnterKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      await createChallengeCommentReply();
    }
  };

  const toggleReplies = () => setShowReplies(!showReplies);
  const toggleIsReplying = () => setIsReplying(!isReplying);
  const loggedinUser = useSession();

  return (
    <div className="flex flex-col p-2">
      <SingleComment
        comment={comment}
        readonly={readonly}
        onClickReply={toggleIsReplying}
        onDelete={() => {
          if (onDelete) onDelete();
          queryClient.invalidateQueries([replyQueryKey]);
        }}
      />
      {isReplying && (
        <div className="pl-3">
          <CommentInput
            value={replyText}
            onCancel={() => {
              setIsReplying(false);
            }}
            onChange={setReplyText}
            onKeyDown={handleEnterKey}
            onSubmit={async () => {
              await createChallengeCommentReply();
              setIsReplying(false);
            }}
            mode="edit"
          />
        </div>
      )}
      {comment._count.replies > 0 && (
        <button
          className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
          onClick={toggleReplies}
        >
          {!showReplies ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          <div className="text-xs">
            {comment._count.replies == 1 ? '1 reply' : `${comment._count.replies} replies`}
          </div>
        </button>
      )}
      {/* ADD PAGINATION IN THE REPLIES */}
      {showReplies && (
        <div className="flex flex-col gap-0.5 p-2 pl-6 pr-0">
          {replies?.comments.map((reply) => (
            <SingleComment
              key={comment.id}
              comment={reply}
              readonly={loggedinUser.data?.user?.id === comment.user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SingleComment = ({
  comment,
  readonly = false,
  onClickReply,
  onDelete,
  isReply,
}: SingleCommentProps) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);
  const isTooManyLines = comment.text.split('\n').length > 15;
  const [showReadMore, setShowReadMore] = useState(isTooManyLines); // take some default value from the calculation of characters

  useEffect(() => {
    setShowReadMore(isTooManyLines);
  }, [isTooManyLines]);

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

  async function copyCommentUrlToClipboard() {
    await navigator.clipboard.writeText(`${window.location.href}/comment/${comment.id}`);
  }

  const loggedinUser = useSession();

  const isAuthor = loggedinUser.data?.user?.id === comment.user.id;

  return (
    <>
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
      <div>
        {!isEditing && (
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
        )}
        {isEditing && (
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
        )}
      </div>
      <>
        {!readonly && (
          <div className="flex items-center gap-4 py-2">
            <div
              onClick={() => {
                copyPathNotifyUser();
              }}
              className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
            >
              <Share size={16} />
              <div className="text-xs">Share</div>
            </div>
            {!isReply && (
              <button
                className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
                onClick={onClickReply}
              >
                <Reply size={18} />
                <div className="text-xs">Reply</div>
              </button>
            )}
            {isAuthor && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Pencil size={16} />
                <div className="text-xs">Edit</div>
              </button>
            )}
            {isAuthor ? (
              <CommentDeleteDialog comment={comment} onDelete={onDelete} asChild>
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
    </>
  );
};

export default Comment;

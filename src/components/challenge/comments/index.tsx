'use client';

import clsx from 'clsx';
import { ChevronDown, MessageCircle, Loader2, Code, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Comment from '~/components/challenge/comments/comment';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/use-toast';
import NoComments from './nocomments';
import { addComment } from './comment.action';
import { Textarea } from '~/components/ui/textarea';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getInfiniteComments } from './getCommentRouteData';
import { CommentSkeleton } from './comment-skeleton';

const MAX_COMMENT_LENGTH = 1000;

interface Props {
  challengeId: number;
  commentCount: number;
}

const Comments = ({ challengeId, commentCount }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { ref, inView } = useInView();

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryFn: ({ pageParam = '' }) =>
      getInfiniteComments({ challengeId, take: 10, lastCursor: +pageParam }),
    queryKey: ['comments', challengeId],
    getNextPageParam: (lastPage) => lastPage.metaData.lastCursor,
  });

  const handleClick = () => {
    setShowComments(!showComments);
  };

  const handleEnterKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.shiftKey && e.key === 'Enter' && !isCommenting) {
      await createChallengeComment();
    }
  };

  async function createChallengeComment() {
    try {
      setIsCommenting(true);
      const res = await addComment({
        text,
        rootChallengeId: challengeId,
        rootType: 'CHALLENGE',
      });
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
      setIsCommenting(false);
      setText('');
      await queryClient.invalidateQueries(['comments', challengeId]);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    } finally {
      router.refresh();
    }
  }

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <div
      className={clsx(
        'sticky bottom-0 overflow-hidden border-t border-zinc-300 bg-background/90 shadow-[0_0_3rem_-0.25rem_#0004] backdrop-blur-sm duration-300 dark:border-zinc-700 dark:border-b-muted dark:bg-muted/90 dark:shadow-[0_0_3rem_-0.25rem_#0008]',
        {
          'lg:border-t-none': showComments,
        },
      )}
    >
      <div className="relative">
        <button
          className="flex w-full items-center justify-between gap-2 p-3 font-medium text-neutral-500 duration-300 hover:text-neutral-700 focus:outline-none dark:hover:text-zinc-300"
          onClick={() => handleClick()}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5"></MessageCircle>
            Comments ({commentCount})
          </div>
          <ChevronDown
            className={clsx('h-4 w-4 duration-300', {
              '-rotate-180': !showComments,
            })}
          ></ChevronDown>
        </button>
        <div
          className={clsx(
            'custom-scrollable-element flex flex-col-reverse overscroll-contain duration-300',
            {
              'h-36 pb-2 lg:h-[calc(100vh_-_247px)]': showComments,
              'h-0 overflow-y-hidden': !showComments,
              'overflow-y-auto': showComments && data?.pages[0]?.data.length !== 0,
            },
          )}
        >
          {(status === 'loading' || isFetchingNextPage) && <CommentSkeleton />}
          {status === 'success' &&
            (data?.pages[0]?.data.length === 0 ? (
              <NoComments />
            ) : (
              data?.pages.map((page) =>
                page.data.map((comment, index) =>
                  page.data.length === index + 1 ? (
                    <div ref={ref} key={index}>
                      <Comment key={comment.id} comment={comment} />
                    </div>
                  ) : (
                    <Comment key={comment.id} comment={comment} />
                  ),
                ),
              )
            ))}
        </div>
        <div className="relative m-2 mt-0 flex items-end justify-between rounded-xl rounded-br-lg bg-background/90 bg-neutral-100 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
          <Textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={handleEnterKey}
            rows={3}
            className="min-h-0 resize-none border-0 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter your comment here."
          />
          <Code className="absolute bottom-0 left-1 h-7 w-7 cursor-pointer stroke-gray-500 p-2 duration-150 hover:stroke-gray-600 dark:stroke-zinc-400 dark:hover:stroke-zinc-300"></Code>
          <Link2 className="absolute bottom-0 left-7 h-7 w-7 cursor-pointer stroke-gray-500 p-2 duration-150 hover:stroke-gray-600 dark:stroke-zinc-400 dark:hover:stroke-zinc-300"></Link2>
          <div className="flex flex-col items-end justify-end gap-2 p-2">
            <div
              className={`text-sm  ${
                text.length > MAX_COMMENT_LENGTH
                  ? 'text-red-600 dark:text-red-400'
                  : text.length > MAX_COMMENT_LENGTH * 0.9
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-neutral-500 dark:text-zinc-500'
              }`}
            >
              {text.length}/{MAX_COMMENT_LENGTH}
            </div>
            {/* TODO: add disabled state with tooltip prompting to log in if user is logged out */}
            <Button
              disabled={text.length > MAX_COMMENT_LENGTH || text.length === 0 || isCommenting}
              onClick={createChallengeComment}
              className={`h-8 w-[5.5rem] rounded-lg rounded-br-sm
            px-3 py-2 ${
              text.length > MAX_COMMENT_LENGTH
                ? 'bg-red-600 hover:bg-red-500 dark:bg-red-400 dark:hover:bg-red-300'
                : 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300'
            }`}
            >
              {isCommenting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : text.length > MAX_COMMENT_LENGTH ? (
                'Too Long'
              ) : (
                'Comment'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;

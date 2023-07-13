'use client';

import clsx from 'clsx';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Comment from '~/components/challenge/comments/comment';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/use-toast';
import NoComments from '../nocomments';
import { addChallengeComment } from './comment.action';
import { Textarea } from '~/components/ui/textarea';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getInfiniteComments } from './getCommentRouteData';
import { CommentSkeleton } from '../comment-skeleton';

interface Props {
  challengeId: number;
  commentCount: number;
}

const Comments = ({ challengeId, commentCount }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const router = useRouter();
  const { ref, inView } = useInView();

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryFn: ({ pageParam = '' }) =>
      getInfiniteComments({ challengeId, take: 10, lastCursor: pageParam }),
    queryKey: ['comments'],
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
      const res = await addChallengeComment(challengeId, text);
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
    <div className="relative">
      <button
        className="flex w-full items-center justify-between gap-2 p-3 font-medium text-neutral-500 duration-300 hover:text-neutral-700 dark:hover:text-zinc-300"
        onClick={() => handleClick()}
      >
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5"></MessageCircle>
          &nbsp; Comments ({commentCount})
        </div>
        <ChevronDown
          className={clsx('h-4 w-4 duration-300', {
            '-rotate-180': !showComments,
          })}
        ></ChevronDown>
      </button>
      <div
        className={clsx('flex flex-col-reverse overscroll-contain duration-300', {
          'h-64 overflow-y-auto': showComments,
          'h-0 overflow-y-hidden': !showComments,
        })}
      >
        {(status === 'loading' || isFetchingNextPage) && <CommentSkeleton />}
        {status === 'success' &&
          (data?.pages[0]?.data.length === 0 ? (
            <NoComments></NoComments>
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
      <div className="m-2 mt-0 flex items-end justify-between gap-2 rounded-xl bg-background/90 bg-neutral-100 p-1 pr-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={handleEnterKey}
          rows={2}
          className="min-h-0 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Enter your comment here."
        />
        <Button
          onClick={createChallengeComment}
          className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default Comments;

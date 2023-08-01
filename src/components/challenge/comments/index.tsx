'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronDown, Loader2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type RefObject, useEffect, useRef, useState } from 'react';
import Comment from '~/components/challenge/comments/comment';
import { Button } from '~/components/ui/button';
import { Markdown } from '~/components/ui/markdown';
import { Pagination2 } from '~/components/ui/pagination';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';
import { CommentSkeleton } from './comment-skeleton';
import { addComment } from './comment.action';
import { getPaginatedComments } from './getCommentRouteData';
import NoComments from './nocomments';

interface Props {
  challengeId: number;
  commentCount: number;
}

export const Comments = ({ challengeId, commentCount }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState('');
  const [commentMode, setCommentMode] = useState<'editor' | 'preview'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef, text, commentMode);

  const queryClient = useQueryClient();
  const router = useRouter();

  const [page, setPage] = useState(1);

  const { status, data } = useQuery({
    queryKey: [`challenge-${challengeId}-comments`, page],
    queryFn: () => getPaginatedComments({ challengeId, page }),
    keepPreviousData: true,
    staleTime: 5000,
  });

  const handleClick = () => {
    setShowComments(!showComments);
  };

  const handleEnterKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === 'Enter' && !isSubmitting) {
      e.preventDefault();
      await createChallengeComment();
    }
  };

  async function createChallengeComment() {
    try {
      setIsSubmitting(true);
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
      setIsSubmitting(false);
      setText('');
      queryClient.invalidateQueries([`challenge-${challengeId}-comments`, page]);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    } finally {
      setCommentMode('editor');
      router.refresh();
    }
  }

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
            <MessageCircle className="h-5 w-5" />
            Comments ({commentCount})
          </div>
          <ChevronDown
            className={clsx('h-4 w-4 duration-300', {
              '-rotate-180': !showComments,
            })}
          />
        </button>
        <div
          className={clsx(
            'custom-scrollable-element flex flex-col overscroll-contain duration-300',
            {
              'h-[calc(100vh_-_164px)] pb-2': showComments,
              'h-0 overflow-y-hidden': !showComments,
              'overflow-y-auto': showComments && data?.comments.length !== 0,
            },
          )}
        >
          <div className="m-2 mt-0 flex flex-col rounded-xl rounded-br-lg bg-background/90 bg-neutral-100 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
            <div>
              {commentMode === 'editor' && (
                <Textarea
                  ref={textAreaRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  onKeyDown={handleEnterKey}
                  className="resize-none border-0 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Enter your comment here."
                />
              )}
              {commentMode === 'preview' && (
                <div className="p-2">
                  <Markdown>{text}</Markdown>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <div className="flex gap-2 p-2">
                <Button
                  variant="ghost"
                  className="h-8"
                  onClick={() => setCommentMode(commentMode === 'editor' ? 'preview' : 'editor')}
                >
                  {commentMode === 'editor' ? 'Preview' : 'Edit'}
                </Button>
                <Button
                  disabled={text.length === 0 || isSubmitting}
                  onClick={createChallengeComment}
                  className="h-8 w-[5.5rem] rounded-lg rounded-br-sm bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Comment'}
                </Button>
              </div>
            </div>
          </div>
          {status === 'loading' && <CommentSkeleton />}
          <div className="flex-1">
            {status === 'success' &&
              (data.comments.length === 0 ? (
                <NoComments />
              ) : (
                data?.comments?.map((comment) => <Comment key={comment.id} comment={comment} />)
              ))}
          </div>
          <div className="mt-2 flex justify-center">
            <Pagination2 currentPage={page} totalPages={data?.totalPages ?? 0} onClick={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

function useAutosizeTextArea(
  textAreaRef: RefObject<HTMLTextAreaElement>,
  value: string,
  commentMode: string,
) {
  useEffect(() => {
    if (textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
    // eslint-disable-next-line
  }, [textAreaRef.current, value, commentMode]);
}

'use client';

import type { CommentRoot } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { Comment } from '~/components/challenge/comments/comment';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/use-toast';
import { CommentInput } from './comment-input';
import { CommentSkeleton } from './comment-skeleton';
import { addComment } from './comment.action';
import { getPaginatedComments } from './getCommentRouteData';
import NoComments from './nocomments';

interface Props {
  rootId: number;
  type: CommentRoot;
}

export const Comments = ({ rootId, type }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState('');
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const queryKey = [`${type.toLowerCase()}-${rootId}-comments`, page];

  const { status, data } = useQuery({
    queryKey,
    queryFn: () => getPaginatedComments({ rootId, page, rootType: type }),
    keepPreviousData: true,
    staleTime: 5000,
  });

  async function createChallengeComment() {
    try {
      const res = await addComment({
        text,
        rootId,
        rootType: type,
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
      setText('');
      queryClient.invalidateQueries(queryKey);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    }
  }

  const handleChangePage = (page: number) => {
    setPage(page);
    commentContainerRef.current?.scroll({
      top: 128,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={clsx(
        'absolute bottom-0 w-full overflow-hidden border-t border-zinc-300 bg-background/90 shadow-[0_0_3rem_-0.25rem_#0004] backdrop-blur-sm duration-300 dark:border-zinc-700 dark:border-b-muted dark:bg-muted/90 dark:shadow-[0_0_3rem_-0.25rem_#0008]',
        {
          'lg:border-t-none': showComments,
        },
      )}
    >
      <div className="relative">
        <button
          className="flex w-full items-center justify-between gap-2 p-3 font-medium text-neutral-500 duration-300 hover:text-neutral-700 focus:outline-none dark:hover:text-zinc-300"
          onClick={() => setShowComments(!showComments)}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
            {data?.totalComments != null && <span>({data?.totalComments})</span>}
          </div>
          <ChevronDown
            className={clsx('h-4 w-4 duration-300', {
              '-rotate-180': !showComments,
            })}
          />
        </button>
        <div
          ref={commentContainerRef}
          className={clsx(
            'custom-scrollable-element flex flex-col overscroll-contain duration-300',
            {
              'h-64 pb-4 md:h-[calc(100vh_-_164px)]': showComments,
              'h-0 overflow-y-hidden': !showComments,
              'overflow-y-auto': showComments && data?.comments.length !== 0,
            },
          )}
        >
          <div className="m-2 mt-0">
            <CommentInput
              onChange={setText}
              value={text}
              onSubmit={createChallengeComment}
              mode="create"
            />
          </div>
          {status === 'loading' && <CommentSkeleton />}
          <div className="flex-1">
            {status === 'success' &&
              (data.comments.length === 0 ? (
                <NoComments />
              ) : (
                data?.comments?.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    rootId={rootId}
                    type={type}
                    queryKey={queryKey}
                  />
                ))
              ))}
          </div>
          {(data?.totalPages ?? 0) > 1 && (
            <div className="mt-2 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={data?.totalPages ?? 0}
                onClick={handleChangePage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Pagination({
  currentPage,
  totalPages,
  onClick,
}: {
  totalPages: number;
  currentPage: number;
  onClick(page: number): void;
}) {
  const maxVisiblePages = 5;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = currentPage - halfVisiblePages;
  let endPage = currentPage + halfVisiblePages;

  if (startPage <= 0) {
    startPage = 1;
    endPage = Math.min(totalPages, maxVisiblePages);
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - maxVisiblePages + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav className="justify-space-between flex items-center gap-2">
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => onClick(Math.max(0, currentPage - 1))}
      >
        <ChevronLeft />
      </Button>
      {pages.map((page) => (
        <Button
          variant="ghost"
          key={`pagination-${page}`}
          className={clsx({ 'border border-black dark:border-white/30 ': page === currentPage })}
          onClick={() => onClick(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onClick(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

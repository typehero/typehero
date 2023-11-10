'use client';

import type { CommentRoot } from '@repo/db/types';
import { toast } from '@repo/ui/components/use-toast';
import { ChevronDown, MessageCircle } from '@repo/ui/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Comment } from './comment';
import { CommentInput } from './comment-input';
import { CommentSkeleton } from './comment-skeleton';
import { addComment } from './comment.action';
import { getPaginatedComments, type PreselectedCommentMetadata } from './getCommentRouteData';
import NoComments from './nocomments';
import { Pagination } from '../pagination';
import { SortSelect } from '../sort-select';

interface Props {
  preselectedCommentMetadata?: PreselectedCommentMetadata;
  expanded?: boolean;
  rootId: number;
  type: CommentRoot;
}

const sortKeys = [
  {
    label: 'Newest Comments',
    value: 'newest',
    key: 'createdAt',
    order: 'desc',
  },
  {
    label: 'Oldest Comments',
    value: 'oldest',
    key: 'createdAt',
    order: 'asc',
  },
  {
    label: 'Most Votes',
    value: 'votes',
    key: 'vote',
    order: 'desc',
  },
  {
    label: 'Most Replies',
    value: 'replies',
    key: 'replies',
    order: 'desc',
  },
] as const;

// million-ignore
export function Comments({ preselectedCommentMetadata, rootId, type, expanded = false }: Props) {
  const [showComments, setShowComments] = useState(expanded);
  const [text, setText] = useState('');
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(preselectedCommentMetadata?.page ?? 1);
  const [sortKey, setSortKey] = useState<(typeof sortKeys)[number]>(sortKeys[0]);
  const queryKey = [`${type.toLowerCase()}-${rootId}-comments`, sortKey.value, page];
  const { status, data } = useQuery({
    queryKey,
    queryFn: () =>
      getPaginatedComments({
        rootId,
        page,
        rootType: type,
        sortKey: sortKey.key,
        sortOrder: sortKey.order,
      }),
    keepPreviousData: true,
    staleTime: 60000, // one minute
    refetchOnWindowFocus: false,
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
      queryClient.invalidateQueries([`${type.toLowerCase()}-${rootId}-comments`]);
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

  const handleValueChange = (value: string) => {
    setSortKey(sortKeys.find((sk) => sk.value === value) ?? sortKeys[0]);
    setPage(1);
  };

  return (
    <div
      className={clsx(
        'bg-background/90 dark:border-b-muted dark:bg-muted/90 absolute bottom-0 max-h-full w-full overflow-hidden border-t border-zinc-300 backdrop-blur-sm duration-300 dark:border-zinc-700',
        {
          'lg:border-t-none': showComments,
        },
      )}
    >
      <div className="relative">
        <button
          className="flex w-full items-center justify-between gap-2 p-3 font-medium text-neutral-500 duration-300 hover:text-neutral-700 focus:outline-none dark:hover:text-zinc-300"
          onClick={() => {
            setShowComments(!showComments);
          }}
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments
            {data?.totalComments != null && <span>({data.totalComments})</span>}
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
              'h-64 pb-4 md:h-[calc(100vh_-_164px)]': showComments,
              'h-0 overflow-y-hidden': !showComments,
              'overflow-y-auto': showComments && (data?.comments.length ?? 0) > 0,
            },
          )}
          ref={commentContainerRef}
        >
          <div className="m-2 mb-4 mt-0">
            <CommentInput
              mode="create"
              onChange={setText}
              onSubmit={createChallengeComment}
              value={text}
            />
          </div>
          {(data?.comments.length ?? 0) > 0 && (
            <SortSelect
              currentSortKey={sortKey}
              totalSortKeys={sortKeys}
              onValueChange={handleValueChange}
            />
          )}
          {status === 'loading' && <CommentSkeleton />}
          <div className="flex-1">
            {status === 'success' &&
              (data.comments.length === 0 ? (
                <NoComments />
              ) : (
                data.comments.map((comment) => (
                  <Comment
                    preselectedCommentMetadata={preselectedCommentMetadata}
                    comment={comment}
                    key={comment.id}
                    queryKey={queryKey}
                    rootId={rootId}
                    type={type}
                  />
                ))
              ))}
          </div>
          {(data?.totalPages ?? 0) > 1 && (
            <div className="mt-2 flex justify-center">
              <Pagination
                currentPage={page}
                onClick={handleChangePage}
                totalPages={data?.totalPages ?? 0}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

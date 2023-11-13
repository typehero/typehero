'use client';

import type { CommentRoot } from '@repo/db/types';
import { ChevronDown, MessageCircle } from '@repo/ui/icons';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Comment } from './comment';
import { CommentInput } from './comment-input';
import { CommentSkeleton } from './comment-skeleton';
import { getPaginatedComments, type PreselectedCommentMetadata } from './getCommentRouteData';
import NoComments from './nocomments';
import { Pagination } from '../pagination';
import { SortSelect } from '../sort-select';
import { useComments } from './comments.hooks';
import { sortKeys } from './comments.constants';

interface Props {
  preselectedCommentMetadata?: PreselectedCommentMetadata;
  expanded?: boolean;
  rootId: number;
  type: CommentRoot;
}

// million-ignore
export function Comments({ preselectedCommentMetadata, rootId, type, expanded = false }: Props) {
  const [showComments, setShowComments] = useState(expanded);
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    addComment,
    commentsMeta,
    status,
    changePage,
    changeSorting,
    deleteComment,
    updateComment,
  } = useComments({
    type,
    rootId,
  });

  const handleChangePage = (page: number) => {
    changePage(page);
    commentContainerRef.current?.scroll({
      top: 128,
      behavior: 'smooth',
    });
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
            {data?.totalComments != null ? <span>({data.totalComments})</span> : null}
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
            <CommentInput mode="create" onSubmit={addComment} />
          </div>
          {(data?.comments.length ?? 0) > 0 && (
            <SortSelect
              currentSortKey={commentsMeta.sort}
              totalSortKeys={sortKeys}
              onValueChange={changeSorting}
            />
          )}
          {status === 'pending' && <CommentSkeleton />}
          <div className="flex-1">
            {status === 'success' &&
              (data?.comments.length === 0 ? (
                <NoComments />
              ) : (
                data?.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    preselectedCommentMetadata={preselectedCommentMetadata}
                    comment={comment}
                    rootId={rootId}
                    type={type}
                    deleteComment={deleteComment}
                    updateComment={updateComment}
                  />
                ))
              ))}
          </div>
          {(data?.totalPages ?? 0) > 1 && (
            <div className="mt-2 flex justify-center">
              <Pagination
                currentPage={commentsMeta.page}
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

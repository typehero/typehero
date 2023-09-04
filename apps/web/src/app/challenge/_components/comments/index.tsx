'use client';

import type { Comment as CommentType, CommentRoot } from '@repo/db/types';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toggle,
  toast,
} from '@repo/ui';
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle } from '@repo/ui/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Comment } from './comment';
import { CommentInput } from './comment-input';
import { CommentSkeleton } from './comment-skeleton';
import { addComment } from './comment.action';
import {
  getPaginatedComments,
  getSkeletonComments,
  type SelectedCommentProps,
  type SortOrder,
} from './getCommentRouteData';
import NoComments from './nocomments';
import { COMMENT_PAGESIZE } from '~/app/constants';

const sortKeys = [
  {
    label: 'Created At',
    value: 'createdAt',
  },
  {
    label: '# of Votes',
    value: 'vote',
  },
  {
    label: '# of Replies',
    value: 'replies',
  },
] as const;

interface Props {
  rootId: number;
  type: CommentRoot;
  selectedComment?: CommentType | null;
}

export function Comments({ rootId, type, selectedComment }: Props) {
  const [showComments, setShowComments] = useState<boolean>(selectedComment != null);
  const [text, setText] = useState('');
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(selectedComment ? 0 : 1);
  const [sortKey, setSortKey] = useState<(typeof sortKeys)[number]>(sortKeys[0]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedCommentIndex, setSelectedCommentIndex] = useState({
    commentIndex: -1,
    replyIndex: -1,
  });

  const queryKey = [`${type.toLowerCase()}-${rootId}-comments`, sortKey.value, sortOrder, page];

  const skeletonQueryKey = [
    `${type.toLowerCase()}-${rootId}-comments-skeleton`,
    sortKey.value,
    sortOrder,
    page,
  ];
  const skeletonData = useQuery({
    queryKey: skeletonQueryKey,
    queryFn: () =>
      getSkeletonComments({ rootId, rootType: type, sortKey: sortKey.value, sortOrder }),
    keepPreviousData: true,
    staleTime: 50000,
  });

  const p = page < 1 ? 1 : page;
  const { status, data } = useQuery({
    queryKey,
    queryFn: () =>
      getPaginatedComments({ rootId, page: p, rootType: type, sortKey: sortKey.value, sortOrder }),
    keepPreviousData: true,
    staleTime: 5000,
  });

  useEffect(() => {
    function calculateSelectedCommentIndex() {
      if (!selectedComment) return;
      if (!skeletonData) return;
      if (skeletonData.data == undefined) return;

      // only re-calculate the index of selectedComment if it's not already correct
      if (
        skeletonData.data[selectedCommentIndex.commentIndex]?.id == selectedComment.id ||
        skeletonData.data[selectedCommentIndex.commentIndex]?.replies[
          selectedCommentIndex.replyIndex
        ]?.id == selectedComment.id
      )
        return;

      // get index of selectedComment
      // due to different sortKey s, we have to iterate over the entire array to find
      // the page index of selectedComment, there's no closed form
      for (let i = 0; i < skeletonData.data.length; i++) {
        const currentComment = skeletonData.data[i];
        if (currentComment?.id == selectedComment.id) {
          return setSelectedCommentIndex({
            commentIndex: i,
            replyIndex: -1,
          });
        }
        if (selectedComment?.parentId != null) {
          // for the typescript
          if (currentComment == undefined) continue;

          for (let j = 0; j < currentComment.replies.length; j++) {
            const reply = currentComment.replies[j];
            if (reply?.id == selectedComment.id) {
              if (!reply?.visible) {
                // TODO: moarbetter words
                toast({
                  title: "Can't show this comment.",
                  description: <p>We can't display this comment.</p>,
                });

                return setSelectedCommentIndex({
                  commentIndex: -1,
                  replyIndex: -1,
                });
              }

              return setSelectedCommentIndex({
                commentIndex: i,
                replyIndex: j,
              });
            }
          }
        }
      }

      // comment isn't found, UB
      // toast to alert the user, but apart from that idk what to do
      toast({
        title: '404 - Not Found',
        variant: 'destructive',
        description: <p>We couldn't find the comment you're looking for.</p>,
      });
    }

    calculateSelectedCommentIndex();

    if (selectedCommentIndex.commentIndex > 0 && page < 1) {
      setPage(Math.floor(selectedCommentIndex.commentIndex / COMMENT_PAGESIZE) + 1);
    }
  }, [skeletonData, selectedComment, selectedCommentIndex]);

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
        'bg-background/90 dark:border-b-muted dark:bg-muted/90 absolute bottom-0 w-full overflow-hidden border-t border-zinc-300 shadow-[0_0_3rem_-0.25rem_#0004] backdrop-blur-sm duration-300 dark:border-zinc-700 dark:shadow-[0_0_3rem_-0.25rem_#0008]',
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
              'overflow-y-auto': showComments && data?.comments.length !== 0,
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
          {data?.comments.length !== 0 && (
            <div className="flex items-center gap-2 px-3 py-2">
              <Select
                value={sortKey.value}
                defaultValue="createdAt"
                onValueChange={(value) => {
                  setSortKey(sortKeys.find((sk) => sk.value === value) ?? sortKeys[0]);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort Key" />
                </SelectTrigger>
                <SelectContent>
                  {sortKeys.map((sortKey, index) => (
                    <SelectItem key={index} value={sortKey.value}>
                      {sortKey.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Toggle
                variant="outline"
                size="sm"
                aria-label="Ascending"
                pressed={sortOrder === 'asc'}
                onPressedChange={() => {
                  setSortOrder('asc');
                  setPage(1);
                }}
              >
                <ArrowUpNarrowWide />
              </Toggle>
              <Toggle
                variant="outline"
                size="sm"
                aria-label="Descending"
                pressed={sortOrder === 'desc'}
                onPressedChange={() => {
                  setSortOrder('desc');
                  setPage(1);
                }}
              >
                <ArrowDownNarrowWide />
              </Toggle>
            </div>
          )}
          {status === 'loading' && <CommentSkeleton />}
          <div className="flex-1">
            {status === 'success' &&
              (data.comments.length === 0 ? (
                <NoComments />
              ) : (
                data.comments.map((comment, index) => (
                  <Comment
                    selected={{
                      isSelected: index == selectedCommentIndex.commentIndex,
                      isReplySelected: selectedCommentIndex.replyIndex != -1,
                      replyIndex: selectedCommentIndex.replyIndex,
                    }}
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

function Pagination({
  currentPage,
  totalPages,
  onClick,
}: {
  totalPages: number;
  currentPage: number;
  onClick: (page: number) => void;
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
        disabled={currentPage === 1}
        onClick={() => onClick(Math.max(0, currentPage - 1))}
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      {pages.map((page) => (
        <Button
          className={clsx({ 'border border-black dark:border-white/30 ': page === currentPage })}
          key={`pagination-${page}`}
          onClick={() => onClick(page)}
          variant="ghost"
        >
          {page}
        </Button>
      ))}
      <Button
        disabled={currentPage === totalPages}
        onClick={() => onClick(Math.min(totalPages, currentPage + 1))}
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

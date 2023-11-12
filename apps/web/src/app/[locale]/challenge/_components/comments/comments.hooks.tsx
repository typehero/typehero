import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useReducer } from 'react';

import { commentErrors, sortKeys } from './comments.constants';
import { getPaginatedComments } from './getCommentRouteData';
import type { CommentRoot } from '@repo/db/types';
import {
  addComment as addCommentAction,
  deleteComment as deleteCommentAction,
  replyComment,
  updateComment as updateCommentAction,
} from './comment.action';
import { toast } from '@repo/ui/components/use-toast';

const getRootQueryKey = (rootId: number, type: CommentRoot) =>
  `${type.toLowerCase()}-${rootId}-comments`;

export type SortItem = (typeof sortKeys)[number];

interface CommentsMeta {
  page: number;
  sort: SortItem;
}

interface DefaultCommentsProps {
  rootId: number;
  type: CommentRoot;
}

interface UseCommentsProps extends DefaultCommentsProps {
  initialPage?: number;
}

export function useComments({ type, rootId, initialPage }: UseCommentsProps) {
  const queryClient = useQueryClient();
  const [meta, updateMeta] = useReducer(
    (state: CommentsMeta, action: Partial<CommentsMeta>) => ({ ...state, ...action }),
    {
      page: initialPage ?? 1,
      sort: sortKeys[0],
    },
  );

  const getQueryKey = ({ sort, page }: { sort: string; page: number }) => [
    getRootQueryKey(rootId, type),
    sort,
    page,
  ];

  const { status, data } = useQuery({
    queryKey: getQueryKey({ sort: meta.sort.value, page: meta.page }),
    queryFn: () => {
      return getPaginatedComments({
        rootId,
        page: meta.page,
        rootType: type,
        sortKey: meta.sort.key,
        sortOrder: meta.sort.order,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 60000, // one minute
    refetchOnWindowFocus: false,
  });

  const changePage = (page: number) => {
    updateMeta({ page });
  };

  const changeSorting = (sort: string) => {
    updateMeta({ sort: sortKeys.find((key) => key.value === sort) ?? sortKeys[0], page: 1 });
  };

  const deleteComment = async (commentId: number) => {
    try {
      const res = await deleteCommentAction(commentId);
      if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      } else if (res === 'invalid_comment') {
        toast(commentErrors.invalidId);
      } else {
        toast({
          title: 'Comment Deleted',
          variant: 'success',
          description: 'The comment was successfully deleted.',
        });
      }
    } catch (e) {
      toast({
        ...commentErrors.unexpected,
        variant: 'destructive',
      });
    } finally {
      // If the last comment on the page was deleted, we need to go back a page
      const newPage = data?.comments.length === 1 ? meta.page - 1 : meta.page;
      changePage(newPage);
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ sort: meta.sort.value, page: newPage }),
      });
    }
  };

  const addComment = async (text: string) => {
    try {
      const res = await addCommentAction({
        text,
        rootId,
        rootType: type,
      });
      if (res === 'text_is_empty') {
        toast(commentErrors.empty);
      } else if (res === 'unauthorized') {
        toast({
          ...commentErrors.unauthorized,
          variant: 'destructive',
        });
      }
      const newPage = 1;
      changePage(newPage);
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ sort: meta.sort.value, page: newPage }),
      });
    } catch (e) {
      toast({
        ...commentErrors.unauthorized,
        variant: 'destructive',
      });
    }
  };

  const updateComment = async (text: string, commentId: number) => {
    try {
      const res = await updateCommentAction(text, commentId);
      if (res === 'text_is_empty') {
        toast(commentErrors.empty);
      } else if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      }
    } catch (e) {
      toast({
        ...commentErrors.unauthorized,
        variant: 'destructive',
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ sort: meta.sort.value, page: meta.page }),
      });
    }
  };

  return {
    data,
    status,
    meta,
    changePage,
    changeSorting,
    deleteComment,
    addComment,
    updateComment,
  };
}

interface UseCommentRepliesProps extends DefaultCommentsProps {
  parentCommentId: number;
  enabled: boolean;
}

const REPLIES_PAGESIZE = 5;

export function useCommentsReplies({
  rootId,
  type,
  parentCommentId,
  enabled,
}: UseCommentRepliesProps) {
  const queryClient = useQueryClient();
  const rootQueryKey = [getRootQueryKey(rootId, type)];
  const queryKey = [...rootQueryKey, `comment-${parentCommentId}-replies`];

  const {
    data,
    fetchNextPage,
    isFetching: isFetchingMoreReplies,
    hasNextPage: hasMoreReplies,
    status,
  } = useInfiniteQuery({
    enabled,
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    queryKey,
    queryFn: async ({ pageParam }) => {
      // `page` is the start index of the current page
      const page = Number(pageParam);

      const comments = await getPaginatedComments({
        rootId,
        page,
        take: REPLIES_PAGESIZE,
        rootType: type,
        parentId: parentCommentId,
      });

      return {
        // if the current page is the last, don't return the next cursor
        page: comments.hasMore ? page + 1 : undefined,
        replies: comments.comments,
      };
    },
    getNextPageParam: (_, pages) => pages.at(-1)?.page,
  });

  const addReplyComment = async (text: string) => {
    try {
      const res = await replyComment(
        {
          text,
          rootId,
          rootType: type,
        },
        parentCommentId,
      );
      if (res === 'text_is_empty') {
        toast(commentErrors.empty);
      } else if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      }
    } catch (e) {
      toast({
        ...commentErrors.unauthorized,
        variant: 'destructive',
      });
    } finally {
      //Invalidate the root query to refetch the comments
      queryClient.invalidateQueries({ queryKey: rootQueryKey });
    }
  };

  const updateReplyComment = async (text: string, commentId: number) => {
    try {
      const res = await updateCommentAction(text, commentId);
      if (res === 'text_is_empty') {
        toast(commentErrors.empty);
      } else if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      }
      queryClient.invalidateQueries({ queryKey });
    } catch (e) {
      toast({
        ...commentErrors.unauthorized,
        variant: 'destructive',
      });
    }
  };

  const deleteReplyComment = async (commentId: number) => {
    try {
      const res = await deleteCommentAction(commentId);
      if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      } else if (res === 'invalid_comment') {
        toast(commentErrors.invalidId);
      } else {
        toast({
          title: 'Comment Deleted',
          variant: 'success',
          description: 'The comment was successfully deleted.',
        });
      }
    } catch (e) {
      toast({
        ...commentErrors.unexpected,
        variant: 'destructive',
      });
    } finally {
      //Invalidate the root query to refetch the comments
      queryClient.invalidateQueries({ queryKey: rootQueryKey });
    }
  };

  const showLoadMoreRepliesBtn = hasMoreReplies || isFetchingMoreReplies;

  return {
    data,
    status,
    fetchNextPage,
    addReplyComment,
    updateReplyComment,
    deleteReplyComment,
    showLoadMoreRepliesBtn,
  };
}

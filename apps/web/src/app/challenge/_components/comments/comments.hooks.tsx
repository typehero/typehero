import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useReducer } from 'react';

import { commentErrors, sortKeys } from './comments.constants';
import {
  getAllComments,
  getPaginatedComments,
  type PaginatedComments,
} from './getCommentRouteData';
import type { CommentRoot } from '@repo/db/types';
import {
  addComment as addCommentAction,
  deleteComment as deleteCommentAction,
  replyComment,
  updateComment as updateCommentAction,
  type CommentToCreate,
} from './comment.action';
import { toast } from '@repo/ui/components/use-toast';
import type { ChallengeRouteData } from '../../[slug]/getChallengeRouteData';
import type { SolutionRouteData } from '../../[slug]/solutions/[solutionId]/getSolutionIdRouteData';

const getRootQueryKey = (rootId: number, type: CommentRoot) =>
  `${type.toLowerCase()}-${rootId}-comments`;

export type SortItem = (typeof sortKeys)[number];

interface CommentsMeta {
  page: number;
  sort: SortItem;
}

type UseCommentsProps =
  | {
      root: ChallengeRouteData['challenge'];
      rootType: 'CHALLENGE';
      initialPage?: number;
    }
  | {
      root: SolutionRouteData;
      rootType: 'SOLUTION';
      initialPage?: number;
    };

export function useComments(props: UseCommentsProps) {
  const { rootType, root, initialPage } = props;
  const queryClient = useQueryClient();
  const [commentsMeta, updateCommentsMeta] = useReducer(
    (state: CommentsMeta, action: Partial<CommentsMeta>) => ({ ...state, ...action }),
    {
      page: initialPage ?? 1,
      sort: sortKeys[0],
    },
  );

  const getQueryKey = ({ sort, page }: { sort: string; page: number }) => [
    getRootQueryKey(root.id, rootType),
    sort,
    page,
  ];

  const { status, data } = useQuery({
    queryKey: getQueryKey({ sort: commentsMeta.sort.value, page: commentsMeta.page }),
    queryFn: () => {
      return getPaginatedComments({
        rootId: root.id,
        page: commentsMeta.page,
        rootType,
        sortKey: commentsMeta.sort.key,
        sortOrder: commentsMeta.sort.order,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 60000, // one minute
    refetchOnWindowFocus: false,
  });

  const changePage = (page: number) => {
    updateCommentsMeta({ page });
  };

  const changeSorting = (sort: string) => {
    updateCommentsMeta({
      sort: sortKeys.find((key) => key.value === sort) ?? sortKeys[0],
      page: 1,
    });
  };

  const deleteComment = async (commentId: number) => {
    try {
      const res = await deleteCommentAction(commentId);
      if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      } else {
        toast({
          title: 'Comment Deleted',
          variant: 'success',
          description: 'The comment was successfully deleted.',
        });
      }
      const newPage =
        data?.comments.length === 1 && commentsMeta.page > 1
          ? commentsMeta.page - 1
          : commentsMeta.page;
      changePage(newPage);
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ sort: commentsMeta.sort.value, page: newPage }),
      });
    } catch {
      toast({
        ...commentErrors.unexpected,
        variant: 'destructive',
      });
    }
  };

  const addComment = async (text: string) => {
    try {
      const { initialPage: _, ...rest } = props;
      const res = await addCommentAction({
        ...rest,
        text,
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
        queryKey: getQueryKey({ sort: commentsMeta.sort.value, page: newPage }),
      });
    } catch {
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
      queryClient.invalidateQueries({
        queryKey: getQueryKey({ sort: commentsMeta.sort.value, page: commentsMeta.page }),
      });
    } catch {
      toast({
        ...commentErrors.unauthorized,
        variant: 'destructive',
      });
    }
  };

  return {
    data,
    status,
    commentsMeta,
    changePage,
    changeSorting,
    deleteComment,
    addComment,
    updateComment,
  };
}

export type UseCommentRepliesProps =
  | {
      root: ChallengeRouteData['challenge'];
      type: 'CHALLENGE';
      parentComment: PaginatedComments['comments'][number];
      enabled: boolean;
      preselectedReplyId?: number;
    }
  | {
      root: SolutionRouteData;
      type: 'SOLUTION';
      parentComment: PaginatedComments['comments'][number];
      enabled: boolean;
      preselectedReplyId?: number;
    };

const REPLIES_PAGESIZE = 5;

export function useCommentsReplies({
  root,
  type,
  parentComment,
  enabled,
  preselectedReplyId,
}: UseCommentRepliesProps) {
  const queryClient = useQueryClient();
  const rootQueryKey = [getRootQueryKey(root.id, type)];
  const queryKey = [...rootQueryKey, `comment-${parentComment.id}-replies`];

  const { data: replies } = useQuery({
    queryKey,
    queryFn: () => getAllComments({ rootId: root.id, rootType: type, parentId: parentComment.id }),
    staleTime: 5000,
    enabled,
  });

  const {
    data,
    fetchNextPage,
    isFetching: isFetchingMoreReplies,
    hasNextPage: hasMoreReplies,
    refetch,
    status,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [...queryKey, 'paginated'],
    queryFn: ({ pageParam }) => {
      // `cursor` is the start index of the current page
      const cursor = Number(pageParam);

      let take = REPLIES_PAGESIZE;
      if (preselectedReplyId && cursor === 0) {
        const preselectedReplyIndex = replies!.findIndex(
          (reply) => preselectedReplyId === reply.id,
        );
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
    enabled: Boolean(replies?.length),
    getNextPageParam: (_, pages) => pages.at(-1)?.cursor,
  });

  useEffect(() => {
    if (replies) {
      refetch();
    }
  }, [replies, refetch]);

  const addReplyComment = async (text: string) => {
    try {
      const res = await replyComment(
        {
          text,
          root,
          rootType: type,
        } as CommentToCreate,
        parentComment,
      );
      if (res === 'text_is_empty') {
        toast(commentErrors.empty);
      } else if (res === 'unauthorized') {
        toast(commentErrors.unauthorized);
      }
      //Invalidate the root query to refetch the comments
      queryClient.invalidateQueries({ queryKey: rootQueryKey });
    } catch {
      toast({
        ...commentErrors.unauthorized,
        variant: 'destructive',
      });
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
    } catch {
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
      } else {
        toast({
          title: 'Comment Deleted',
          variant: 'success',
          description: 'The comment was successfully deleted.',
        });
      }
      //Invalidate the root query to refetch the comments
      queryClient.invalidateQueries({ queryKey: rootQueryKey });
    } catch {
      toast({
        ...commentErrors.unexpected,
        variant: 'destructive',
      });
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

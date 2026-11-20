import { TRPCClientError } from '@trpc/client';

export const COMMENTS_PAGE_SIZE = 10;

export const sortKeys = [
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

export const commentErrors = {
  empty: { title: 'Empty Comment', description: 'You cannot post an empty comment.' },
  unauthorized: { title: 'Unauthorized', description: 'You must be logged in to post a comment.' },
  forbidden: {
    title: 'Not Allowed',
    description: 'You do not have permission to change this comment.',
  },
  invalidText: {
    title: 'Invalid Comment',
    description: 'Your comment is empty, too long, or contains language that is not allowed.',
  },
  notFound: { title: 'Comment Not Found', description: 'This comment no longer exists.' },
  unexpected: {
    title: 'Uh Oh!',
    description: 'Something went wrong while handling your comment. Please try again.',
  },
  invalidId: { title: 'Invalid Comment', description: 'The comment id is invalid.' },
};

export const getCommentErrorToast = (error: unknown) => {
  const code = error instanceof TRPCClientError ? error.data?.code : undefined;
  switch (code) {
    case 'UNAUTHORIZED':
      return commentErrors.unauthorized;
    case 'FORBIDDEN':
      return commentErrors.forbidden;
    case 'BAD_REQUEST':
      return commentErrors.invalidText;
    case 'NOT_FOUND':
      return commentErrors.notFound;
    default:
      return commentErrors.unexpected;
  }
};

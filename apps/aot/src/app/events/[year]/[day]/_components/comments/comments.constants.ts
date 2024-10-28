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
  unexpected: {
    title: 'Uh Oh!',
    description: 'An error occurred while trying to delete the comment.',
  },
  invalidId: { title: 'Invalid Comment', description: 'The comment id is invalid.' },
};

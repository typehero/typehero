const sortingKeys = ['createdAt', 'vote', 'replies'] as const;
const sortingOrders = ['asc', 'desc'] as const;

export type SortKey = (typeof sortingKeys)[number];
export type SortOrder = (typeof sortingOrders)[number];

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

export function orderBy(sortKey: SortKey, sortOrder: SortOrder) {
  switch (sortKey) {
    case 'vote':
      return {
        vote: {
          _count: sortOrder,
        },
      };
    case 'replies':
      return {
        replies: {
          _count: sortOrder,
        },
      };
    case 'createdAt':
      return {
        [sortKey]: sortOrder,
      };
  }
}
const sortingKeys = ['createdAt', 'vote', 'replies', 'solutionComment'] as const;
const sortingOrders = ['asc', 'desc'] as const;

export type SortKey = (typeof sortingKeys)[number];
export type SortOrder = (typeof sortingOrders)[number];

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
    case 'solutionComment':
      return {
        solutionComment: {
          _count: sortOrder,
        },
      };
  }
}

export type SortKey = 'createdAt' | 'replies' | 'solutionComment' | 'vote';
export type SortOrder = 'asc' | 'desc';

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

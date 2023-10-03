'use server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { CommentRoot } from '@repo/db/types';

const PAGESIZE = 10;

const sortKeys = ['createdAt', 'vote', 'replies'] as const;
const sortOrders = ['asc', 'desc'] as const;

export type SortKey = (typeof sortKeys)[number];
export type SortOrder = (typeof sortOrders)[number];

function orderBy(sortKey: SortKey, sortOrder: SortOrder) {
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

export type PaginatedComments = NonNullable<Awaited<ReturnType<typeof getPaginatedComments>>>;
export type PreselectedCommentMetadata =
  | NonNullable<Awaited<ReturnType<typeof getPreselectedCommentMetadata>>>
  | NonNullable<Awaited<ReturnType<typeof getPreselectedSolutionCommentMetadata>>>;

export async function getPreselectedCommentMetadata(challengeId: number, commentId: number) {
  const challengeComments = await prisma.comment.findMany({
    where: {
      rootType: 'CHALLENGE',
      rootChallengeId: challengeId,
      visible: true,
      parentId: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      parentId: true,
    },
  });

  const index = challengeComments.findIndex((comment) => comment.id === commentId);
  const selectedComment = challengeComments[index];
  const page = Math.ceil((index + 1) / PAGESIZE);

  return {
    page,
    selectedComment,
    index,
    challengeComments: challengeComments.map((comment) => comment.id),
  };
}

export async function getPreselectedSolutionCommentMetadata(
  solutionId: number,
  commentId: number,
  challengeId: number,
) {
  const solution = await prisma.sharedSolution.findFirst({
    where: {
      id: solutionId,
      challengeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      solutionComment: true,
    },
  });

  if (!solution || !solution.solutionComment) return;

  const comments = solution.solutionComment;

  const index = comments.findIndex((comment) => comment.id === commentId);
  const selectedComment = comments[index];
  const page = Math.ceil((index + 1) / PAGESIZE);

  return {
    page,
    selectedComment,
    index,
    challengeComments: comments.map((comment) => comment.id),
  };
}

export async function getPaginatedComments({
  page,
  rootId,
  rootType,
  parentId = null,
  sortKey = 'createdAt',
  sortOrder = 'desc',
}: {
  page: number;
  rootId: number;
  rootType: CommentRoot;
  parentId?: number | null;
  sortKey?: SortKey;
  sortOrder?: SortOrder;
}) {
  const session = await getServerAuthSession();

  const totalComments = await prisma.comment.count({
    where: {
      rootType,
      parentId,
      visible: true,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
    },
  });

  const totalReplies = await prisma.comment.count({
    where: {
      rootType,
      parentId: {
        not: null,
      },
      visible: true,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
    },
  });

  const comments = await prisma.comment.findMany({
    skip: (page - 1) * PAGESIZE,
    take: PAGESIZE,
    where: {
      rootType,
      parentId,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
      visible: true,
    },
    orderBy: orderBy(sortKey, sortOrder),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          replies: true,
          vote: true,
        },
      },
      vote: {
        select: {
          userId: true,
        },
        where: {
          userId: session?.user.id || '',
        },
      },
      rootChallenge: {
        select: {
          name: true,
        },
      },
      rootSolution: {
        select: {
          title: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalComments / PAGESIZE);

  return {
    totalComments: totalReplies + totalComments,
    totalPages,
    hasMore: page < totalPages,
    comments,
  };
}

export async function getAllComments({
  rootId,
  rootType,
  parentId = null,
  sortKey = 'createdAt',
  sortOrder = 'desc',
}: {
  rootId: number;
  rootType: CommentRoot;
  parentId?: number | null;
  sortKey?: SortKey;
  sortOrder?: SortOrder;
}) {
  const session = await getServerAuthSession();

  const comments = await prisma.comment.findMany({
    where: {
      rootType,
      parentId,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
      visible: true,
    },
    orderBy: orderBy(sortKey, sortOrder),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          replies: true,
          vote: true,
        },
      },
      vote: {
        select: {
          userId: true,
        },
        where: {
          userId: session?.user.id || '',
        },
      },
      rootChallenge: {
        select: {
          name: true,
        },
      },
      rootSolution: {
        select: {
          title: true,
        },
      },
    },
  });

  return comments;
}

'use server';
import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { CommentRoot } from '@repo/db/types';
import { orderBy, type SortKey, type SortOrder } from '~/utils/sorting';

const PAGESIZE = 10;

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

  // this `commentId` couldn't be found (perhaps it was deleted)
  if (index === -1) return;

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

  // this `commentId` couldn't be found (perhaps it was deleted)
  if (index === -1) return;

  const selectedComment = comments[index];
  const page = Math.ceil((index + 1) / PAGESIZE);

  return {
    page,
    selectedComment,
    index,
    challengeComments: comments.map((comment) => comment.id),
  };
}

async function getCommentsCount({
  rootType,
  rootId,
  parentId = null,
}: {
  rootType: CommentRoot;
  rootId: number;
  parentId?: number | null;
}) {
  return prisma.comment.count({
    where: {
      rootType,
      parentId,
      visible: true,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
    },
  });
}

export async function getPaginatedComments({
  page,
  rootId,
  rootType,
  parentId = null,
  sortKey = 'createdAt',
  sortOrder = 'desc',
  take = PAGESIZE,
}: {
  page: number;
  rootId: number;
  rootType: CommentRoot;
  parentId?: number | null;
  sortKey?: SortKey;
  sortOrder?: SortOrder;
  take?: number;
}) {
  const session = await auth();

  const totalComments = await getCommentsCount({ rootType, rootId, parentId });

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
    skip: (page - 1) * take,
    take,
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
          userId: session?.user?.id || '',
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

  const totalPages = Math.ceil(totalComments / take);

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
  const session = await auth();

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
          userId: session?.user?.id || '',
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

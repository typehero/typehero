'use server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { CommentRoot } from '@repo/db/types';

const PAGESIZE = 10;

export type PaginatedComments = NonNullable<Awaited<ReturnType<typeof getPaginatedComments>>>;

export async function getPaginatedComments({
  page,
  rootId,
  rootType,
  parentId = null,
}: {
  page: number;
  rootId: number;
  rootType: CommentRoot;
  parentId?: number | null;
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

  const comments = await prisma.comment.findMany({
    skip: (page - 1) * PAGESIZE,
    take: PAGESIZE,
    where: {
      rootType,
      parentId,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
      visible: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
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

  const totalReplies = comments.reduce((a, c) => a + c._count.replies, 0);

  return {
    totalComments: totalReplies + totalComments,
    totalPages,
    hasMore: page < totalPages,
    comments,
  };
}

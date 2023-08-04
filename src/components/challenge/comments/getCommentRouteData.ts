'use server';
import type { CommentRoot } from '@prisma/client';
import { prisma } from '~/server/db';

const PAGESIZE = 10;

export type PaginatedComments = NonNullable<Awaited<ReturnType<typeof getPaginatedComments>>>;

type _count = PaginatedComments['comments'][number]['_count'];

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
  const totalComments = await prisma.comment.count({
    where: {
      rootType,
      parentId: parentId,
      visible: true,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
    },
  });

  const comments = await prisma.comment.findMany({
    skip: (page - 1) * PAGESIZE,
    take: PAGESIZE,
    where: {
      rootType,
      parentId: parentId,
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
          replies: parentId == null,
        },
      },
      rootChallenge: true,
      rootSolution: true,
    },
  });

  const totalPages = Math.ceil(totalComments / PAGESIZE);

  return {
    totalPages,
    hasMore: page < totalPages,
    comments,
  };
}

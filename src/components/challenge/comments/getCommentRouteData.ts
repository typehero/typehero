'use server';
import type { CommentRoot } from '@prisma/client';
import { prisma } from '~/server/db';

export type PaginatedComments = NonNullable<Awaited<ReturnType<typeof getPaginatedComments>>>;

export async function getPaginatedComments({
  page,
  rootId,
  rootType,
}: {
  rootId: number;
  rootType: CommentRoot;
  page: number;
}) {
  const totalComments = await prisma.comment.count({
    where: {
      rootType,
      visible: true,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
    },
  });

  const comments = await prisma.comment.findMany({
    skip: (page - 1) * 10,
    take: 10,
    where: {
      rootType,
      ...(rootType === 'CHALLENGE' ? { rootChallengeId: rootId } : { rootSolutionId: rootId }),
      visible: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
    },
  });

  const totalPages = Math.ceil(totalComments / 10);

  return {
    totalPages,
    hasMore: page < totalPages,
    comments,
  };
}

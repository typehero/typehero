'use server';
import { prisma } from '~/server/db';

export type PaginatedComments = NonNullable<Awaited<ReturnType<typeof getPaginatedComments>>>;

export async function getPaginatedComments({
  challengeId,
  page,
}: {
  challengeId: number;
  page: number;
}) {
  const totalComments = await prisma.comment.count({
    where: {
      rootType: 'CHALLENGE',
      rootChallengeId: challengeId,
      visible: true,
    },
  });

  const comments = await prisma.comment.findMany({
    skip: (page - 1) * 10,
    take: 10,
    where: {
      rootType: 'CHALLENGE',
      rootChallengeId: challengeId,
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

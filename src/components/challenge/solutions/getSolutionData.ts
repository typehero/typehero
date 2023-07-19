'use server';
import { prisma } from '~/server/db';

export interface SolutionCommentQueryParams {
  solutionId: number;
  take?: number;
  lastCursor?: number;
}

export async function getInfiniteComments({
  solutionId,
  take = 10,
  lastCursor,
}: SolutionCommentQueryParams) {
  const results = await prisma.comment.findMany({
    where: {
      rootType: 'SOLUTION',
      rootSolutionId: solutionId,
    },
    take,
    ...(lastCursor && {
      skip: 1,
      cursor: {
        id: lastCursor,
      },
    }),
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
    },
  });

  const last = results.at(-1);
  const hasNextPage =
    last && last.id
      ? await prisma.comment
          .findMany({
            where: {
              rootSolutionId: solutionId,
            },
            skip: 1,
            take: 1,
            cursor: {
              id: last.id,
            },
          })
          .then((f) => f.length > 0)
      : false;

  return {
    data: results,
    metaData: {
      lastCursor: last ? last.id : null,
      hasNextPage,
    },
  };
}

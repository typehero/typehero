'use server';
import { prisma } from '~/server/db';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getInfiniteComments>>>;

interface QueryParams {
  challengeId: number;
  take?: number;
  lastCursor?: number;
}

export async function getInfiniteComments({ challengeId, take = 10, lastCursor }: QueryParams) {
  console.log({ lastCursor });
  const results = await prisma.challengeComment.findMany({
    where: { challengeId },
    include: { user: true },
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
  });

  if (results.length == 0) {
    return {
      data: [],
      metaData: {
        lastCursor: null,
        hasNextPage: false,
      },
    };
  }

  const lastPostInResults = results[results.length - 1];
  const cursor = lastPostInResults?.id;

  const nextPage = await prisma.challengeComment.findMany({
    where: { challengeId },
    include: { user: true },
    take,
    skip: 1,
    cursor: {
      id: cursor,
    },
  });

  return {
    data: results,
    metaData: {
      lastCursor: cursor,
      hasNextPage: nextPage.length > 0,
    },
  };
}

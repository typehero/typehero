'use server';
import { prisma } from '~/server/db';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getInfiniteComments>>>;

interface QueryParams {
  challengeId: number;
  take?: number;
  lastCursor?: number;
}

export async function getInfiniteComments({ challengeId, lastCursor }: QueryParams) {
  const results = await prisma.comment.findMany({
    where: {
      rootType: 'CHALLENGE',
      rootChallengeId: challengeId,
    },
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
              rootChallengeId: challengeId,
            },
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

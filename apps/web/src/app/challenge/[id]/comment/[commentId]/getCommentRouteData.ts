'use server';
import { type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { cache } from 'react';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getCommentRouteData>>>;

// this is to data to populate the description tab (default tab on challenge page)
export const getCommentRouteData = cache(
  (challengeId: string, commentId: string, session: Session | null) => {
    return prisma.comment.findFirstOrThrow({
      where: {
        id: Number(commentId),
        rootChallengeId: Number(challengeId),
      },
      include: {
        vote: {
          where: {
            userId: session?.user.id || '',
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        parentComment: true,
        replies: true,
      },
    });
  },
);

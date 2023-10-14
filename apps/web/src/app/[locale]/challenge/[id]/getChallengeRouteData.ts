import { type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { cache } from 'react';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getChallengeRouteData>>>;

// this is to data to populate the description tab (default tab on challenge page)
export const getChallengeRouteData = cache((id: string, session: Session | null) => {
  return prisma.challenge.findFirstOrThrow({
    where: {
      id: Number(id),
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          vote: true,
        },
      },
      vote: {
        where: {
          userId: session?.user.id || '',
        },
      },
      bookmark: {
        where: {
          userId: session?.user.id || '',
        },
      },
    },
  });
});

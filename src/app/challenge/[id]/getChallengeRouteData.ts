'use server';
import { type Session } from 'next-auth';
import { cache } from 'react';
import { prisma } from '~/server/db';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getChallengeRouteData>>>;

// this is to data to populate the description tab (default tab on challenge page)
export const getChallengeRouteData = cache((id: string, session: Session | null) => {
  return prisma.challenge.findFirstOrThrow({
    where: {
      id: +id,
      status: 'ACTIVE',
    },
    include: {
      user: true,
      _count: {
        select: { vote: true, comment: true },
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

'use server';
import { type Session } from 'next-auth';
import { prisma } from '~/server/db';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getChallengeRouteData>>>;

// this is to data to populate the description tab (default tab on challenge page)
export async function getChallengeRouteData(id: string, session: Session | null) {
  const challenge = await prisma.challenge.findFirst({
    where: { id: +id },
    include: {
      user: true,
      _count: {
        select: { vote: true },
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
      comment: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: true,
        },
      },
    },
  });

  return challenge;
}

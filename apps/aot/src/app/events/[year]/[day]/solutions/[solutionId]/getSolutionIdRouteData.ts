import { cache } from 'react';
import { prisma } from '@repo/db';
import { type Session } from '@repo/auth/server';
import { redirect } from 'next/navigation';

export type SolutionRouteData = NonNullable<Awaited<ReturnType<typeof getSolutionIdRouteData>>>;

export const getSolutionIdRouteData = cache(
  async (slug: string, solutionId: string, session: Session | null) => {
    const challenge = await prisma.challenge.findFirstOrThrow({
      where: { slug },
      select: { id: true },
    });
    const solution = await prisma.sharedSolution.findFirst({
      where: {
        id: Number(solutionId),
        challengeId: challenge.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            roles: true,
            bio: true,
          },
        },
        _count: {
          select: { vote: true },
        },
        vote: {
          where: {
            userId: session?.user?.id || '',
          },
          select: {
            userId: true,
          },
        },
        challenge: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!solution) {
      redirect(`/challenge/${challenge.id}/solutions`);
    }

    return solution;
  },
);

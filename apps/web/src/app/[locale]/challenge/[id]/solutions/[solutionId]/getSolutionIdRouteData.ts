import { cache } from 'react';
import { prisma } from '@repo/db';
import { type Session } from '@repo/auth/server';
import { redirect } from 'next/navigation';

export const getSolutionIdRouteData = cache(
  async (challengeId: string, solutionId: string, session: Session | null) => {
    const solution = await prisma.sharedSolution.findFirst({
      where: {
        id: Number(solutionId),
        challengeId: Number(challengeId),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: { vote: true },
        },
        vote: {
          where: {
            userId: session?.user.id || '',
          },
          select: {
            userId: true,
          },
        },
      },
    });

    if (!solution) {
      redirect(`/challenge/${challengeId}/solutions`);
    }

    return solution;
  },
);

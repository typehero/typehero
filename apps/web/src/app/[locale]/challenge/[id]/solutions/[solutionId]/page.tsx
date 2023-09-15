import { prisma } from '@repo/db';
import { SolutionDetails } from '../_components/solution-detail';
import { getServerAuthSession, type Session } from '@repo/auth/server';
import { cache } from 'react';
import { Comments } from '~/app/[locale]/challenge/_components/comments';

interface Props {
  params: {
    id: string;
    solutionId: string;
  };
}

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolution>>>;
export default async function SolutionPage({ params: { solutionId, id: challengeId } }: Props) {
  const session = await getServerAuthSession();
  const solution = await getSolution(challengeId, solutionId, session);

  return (
    <div className="relative h-full">
      <SolutionDetails solution={solution} />
      <Comments rootId={solution.id!} type="SOLUTION" />
    </div>
  );
}

export async function generateMetadata({ params: { solutionId } }: Props) {
  const solution = await prisma.sharedSolution.findFirstOrThrow({
    where: {
      id: Number(solutionId),
    },
    include: {
      challenge: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    title: `${solution.title}, solution to ${solution.challenge?.name} | TypeHero`,
    description: `View this solution to ${solution.challenge?.name} on TypeHero.`,
  };
}

const getSolution = cache(
  async (challengeId: string, solutionId: string, session: Session | null) => {
    const solution = await prisma.sharedSolution.findFirstOrThrow({
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

    return solution;
  },
);

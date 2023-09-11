import { prisma } from '@repo/db';
import { SolutionDetails } from '../_components/solution-detail';
import { getServerAuthSession, type Session } from '@repo/auth/server';

interface Props {
  params: {
    solutionId: string;
  };
}

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolution>>>;
export default async function SolutionPage({ params: { solutionId } }: Props) {
  const session = await getServerAuthSession();
  const solution = await getSolution(solutionId, session);

  return <SolutionDetails solution={solution} />;
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

async function getSolution(solutionId: string, session: Session | null) {
  const solution = await prisma.sharedSolution.findFirstOrThrow({
    where: {
      id: Number(solutionId),
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
}

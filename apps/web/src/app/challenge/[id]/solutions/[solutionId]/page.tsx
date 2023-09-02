import { prisma } from '@repo/db';
import { SolutionDetails } from '../_components/solution-detail';

interface Props {
  params: {
    solutionId: string;
  };
}

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolution>>>;
export default async function SolutionPage({ params: { solutionId } }: Props) {
  const solution = await getSolution(solutionId);
  if (!solution) return null;

  return <SolutionDetails solution={solution} />;
}

export async function generateMetadata({ params: { solutionId } }: Props) {
  const solution = await getSolution(solutionId);
  if (!solution) return null;

  return {
    title: `${solution.title}, solution to ${solution.challenge?.name} | TypeHero`,
    description: `View this solution to ${solution.challenge?.name} on TypeHero.`,
  };
}

async function getSolution(solutionId: string) {
  const solution = await prisma.sharedSolution.findFirst({
    where: {
      id: Number(solutionId),
    },
    include: {
      challenge: true,
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  const f = await prisma.comment.findMany({
    where: {
      rootType: 'SOLUTION',
      rootSolutionId: Number(solutionId),
    },
  });

  return {
    ...solution,
    jimComments: f,
  };
}

import { SolutionDetails } from '~/components/challenge/solutions/solution-detail';
import { prisma } from '~/server/db';

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

async function getSolution(solutionId: string) {
  const solution = await prisma.sharedSolution.findFirst({
    where: {
      id: +solutionId,
    },
    include: {
      challenge: true,
      user: true,
    },
  });

  const f = await prisma.comment.findMany({
    where: {
      rootType: 'SOLUTION',
      rootSolutionId: +solutionId,
    },
  });

  return {
    ...solution,
    jimComments: f,
  };
}

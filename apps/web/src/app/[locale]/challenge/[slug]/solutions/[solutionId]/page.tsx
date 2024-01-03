import { prisma } from '@repo/db';
import { SolutionDetails } from '../_components/solution-detail';
import { auth } from '@repo/auth/server';
import { Comments } from '~/app/[locale]/challenge/_components/comments';
import { getSolutionIdRouteData } from './getSolutionIdRouteData';

interface Props {
  params: {
    slug: string;
    solutionId: string;
  };
}

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolutionIdRouteData>>>;
export default async function SolutionPage({ params: { solutionId, slug } }: Props) {
  const session = await auth();

  const solution = await getSolutionIdRouteData(slug, solutionId, session);

  return (
    <div className="relative h-full">
      <SolutionDetails solution={solution} />
      <Comments rootId={solution.id} type="SOLUTION" />
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

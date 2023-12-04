import { prisma } from '@repo/db';
import { SolutionDetails } from '../_components/solution-detail';
import { auth } from '@repo/auth/server';
import { Comments } from '~/app/[locale]/challenge/_components/comments';
import { getSolutionIdRouteData } from './getSolutionIdRouteData';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { redirect } from 'next/navigation';
import { Markdown } from '@repo/ui/components/markdown';
import { getPreselectedSolutionCommentMetadata } from '~/app/[locale]/challenge/_components/comments/getCommentRouteData';

interface Props {
  params: {
    slug: string;
    solutionId: string;
  };
  searchParams: {
    commentId?: string;
  };
}

export type ChallengeSolution = NonNullable<Awaited<ReturnType<typeof getSolutionIdRouteData>>>;
export default async function SolutionPage({ params: { solutionId, slug }, searchParams }: Props) {
  const session = await auth();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  const solution = await getSolutionIdRouteData(slug, solutionId, session);
  const preselectedCommentMetadata = await getPreselectedSolutionCommentMetadata(
    Number(solutionId),
    Number(searchParams.commentId),
    Number(solution.challengeId),
  );

  return (
    <div className="relative h-full">
      <SolutionDetails solution={solution}>
        <div className="prose-invert prose-h3:text-xl mt-6 leading-7">
          <Markdown>{solution.description}</Markdown>
        </div>
      </SolutionDetails>
      <Comments
        rootId={solution.id!}
        type="SOLUTION"
        preselectedCommentMetadata={preselectedCommentMetadata}
        expanded={Boolean(preselectedCommentMetadata)}
      />
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

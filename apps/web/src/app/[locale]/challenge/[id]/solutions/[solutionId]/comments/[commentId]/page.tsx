import { getServerAuthSession, type Session } from '@repo/auth/server';
import { Comments } from '~/app/[locale]/challenge/_components/comments';
import { SolutionDetails } from '~/app/[locale]/challenge/[id]/solutions/_components/solution-detail';
import { getPreselectedSolutionCommentMetadata } from '~/app/[locale]/challenge/_components/comments/getCommentRouteData';
import { getSolutionIdRouteData } from '../../getSolutionIdRouteData';

interface Props {
  params: {
    id: string;
    commentId: string;
    solutionId: string;
  };
}

export default async function SolutionPage({
  params: { solutionId, commentId, id: challengeId },
}: Props) {
  const session = await getServerAuthSession();
  const solution = await getSolutionIdRouteData(challengeId, solutionId, session);
  const preselectedCommentMetadata = await getPreselectedSolutionCommentMetadata(
    Number(solutionId),
    Number(commentId),
    Number(challengeId),
  );

  return (
    <div className="relative h-full">
      <SolutionDetails solution={solution} />
      <Comments
        rootId={Number(solutionId)}
        type="SOLUTION"
        preselectedCommentMetadata={preselectedCommentMetadata}
        expanded
      />
    </div>
  );
}

import { auth } from '~/server/auth';
import { getSolutionIdRouteData } from '../../getSolutionIdRouteData';
import { getPreselectedSolutionCommentMetadata } from '../../../../_components/comments/getCommentRouteData';
import { SolutionDetails } from '../../../_components/solution-detail';
import { Comments } from '../../../../_components/comments';
import { getAotSlug } from '~/utils/getAotSlug';

interface SolutionPageCommentsProps {
  params: Promise<{
    year: string;
    day: string;
    commentId: string;
    solutionId: string;
  }>;
}

export default async function SolutionPageComments(props: SolutionPageCommentsProps) {
  const params = await props.params;

  const {
    solutionId,
    commentId,
    year,
    day
  } = params;

  const session = await auth();
  const solution = await getSolutionIdRouteData(getAotSlug({ year, day }), solutionId, session);
  const preselectedCommentMetadata = await getPreselectedSolutionCommentMetadata(
    Number(solutionId),
    Number(commentId),
    Number(solution.challengeId),
  );

  return (
    <div className="relative h-full">
      <SolutionDetails solution={solution} />
      <Comments
        root={solution}
        type="SOLUTION"
        preselectedCommentMetadata={preselectedCommentMetadata}
        expanded
      />
    </div>
  );
}

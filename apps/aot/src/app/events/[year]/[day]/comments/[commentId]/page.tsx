import { auth } from '~/server/auth';
import { getChallengeRouteData } from '../../getChallengeRouteData';
import { getPreselectedCommentMetadata } from '../../_components/comments/getCommentRouteData';
import { Description } from '../../_components/description';
import { Comments } from '../../_components/comments';
import { getAotSlug } from '~/utils/getAotSlug';
import { isAfterJanuaryFirst } from '~/utils/aot';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    year: string;
    day: string;
    commentId: string;
  };
}

export default async function CommentPage({ params: { year, day, commentId } }: Props) {
  const session = await auth();
  const { challenge } = await getChallengeRouteData(getAotSlug({ year, day }), session);
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    challenge.id,
    Number(commentId),
  );

  if (!isAfterJanuaryFirst(Number(year))) {
    return notFound();
  }

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments
        root={challenge}
        preselectedCommentMetadata={preselectedCommentMetadata}
        type="CHALLENGE"
        expanded
      />
    </div>
  );
}

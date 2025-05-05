import { auth } from '~/server/auth';
import { Comments } from '../../../_components/comments';
import { getPreselectedCommentMetadata } from '../../../_components/comments/getCommentRouteData';
import { Description } from '../../../_components/description';
import { getChallengeRouteData } from '../../getChallengeRouteData';

interface CommentPageProps {
  params: Promise<{
    slug: string;
    commentId: string;
  }>;
}

export default async function CommentPage(props: CommentPageProps) {
  const params = await props.params;

  const { slug, commentId } = params;

  const session = await auth();
  const { challenge } = await getChallengeRouteData(slug, session);
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    challenge.id,
    Number(commentId),
  );

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

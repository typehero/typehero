import { getServerAuthSession } from '@repo/auth/server';
import { Comments } from '../../../_components/comments';
import { getPreselectedCommentMetadata } from '../../../_components/comments/getCommentRouteData';
import { Description } from '../../../_components/description';
import { getChallengeRouteData } from '../../getChallengeRouteData';

interface Props {
  params: {
    slug: string;
    commentId: string;
  };
}

export default async function CommentPage({ params: { slug, commentId } }: Props) {
  const session = await getServerAuthSession();
  const { challenge } = await getChallengeRouteData(slug, session);
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    challenge.id,
    Number(commentId),
  );

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments
        rootId={challenge.id}
        preselectedCommentMetadata={preselectedCommentMetadata}
        type="CHALLENGE"
        expanded
      />
    </div>
  );
}

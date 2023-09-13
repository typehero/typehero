import { getServerAuthSession } from '@repo/auth/server';
import { Comments } from '../../../_components/comments';
import { getPreselectedCommentMetadata } from '../../../_components/comments/getCommentRouteData';
import { Description } from '../../../_components/description';
import { getChallengeRouteData } from '../../getChallengeRouteData';

interface Props {
  params: {
    id: string;
    commentId: string;
  };
}

export default async function CommentPage({ params: { id, commentId } }: Props) {
  const session = await getServerAuthSession();
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    Number(id),
    Number(commentId),
  );
  const challenge = await getChallengeRouteData(id, session);

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments
        rootId={Number(id)}
        preselectedCommentMetadata={preselectedCommentMetadata}
        type="CHALLENGE"
        expanded
      />
    </div>
  );
}

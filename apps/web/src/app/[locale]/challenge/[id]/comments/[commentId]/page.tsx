import { Comments } from '../../../_components/comments';
import { getPreselectedCommentMetadata } from '../../../_components/comments/getCommentRouteData';

interface Props {
  params: {
    id: string;
    commentId: string;
  };
}

export default async function CommentPage({ params: { id, commentId } }: Props) {
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    Number(id),
    Number(commentId),
  );

  return (
    <div className="relative h-full">
      <Comments
        rootId={Number(id)}
        preselectedCommentMetadata={preselectedCommentMetadata}
        type="CHALLENGE"
        expanded
      />
    </div>
  );
}

import { useParams } from 'next/navigation';
import { Comments } from '../../../_components/comments';
import { getPreselectedCommentMetadata } from '../../../_components/comments/getCommentRouteData';

interface Props {
  params: {
    id: string;
    commentId: string;
  };
  searchParams: {
    replyId: string;
  };
}

export default async function CommentPage({
  params: { id, commentId },
  searchParams: { replyId },
}: Props) {
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    Number(id),
    Number(commentId),
    replyId,
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

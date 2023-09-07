import { Comments } from '../../../_components/comments';
import { getPreselectedCommentMetadata } from '../../../_components/comments/getCommentRouteData';

interface Props {
  params: {
    id: string;
    commentId: string;
  };
}

export default async function CommentPage({ params: { id, commentId } }: Props) {
  // this will have all the needed data to feed into the paginated query.
  // specifically the initial page
  const preselectedCommentMetadata = await getPreselectedCommentMetadata(
    Number(id),
    Number(commentId),
  );
  console.log({ preselectedCommentMetadata });
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

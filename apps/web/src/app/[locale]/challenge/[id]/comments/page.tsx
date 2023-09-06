import { Comments } from '../../_components/comments';

interface Props {
  params: {
    id: string;
  };
}

export default async function CommentPage({ params: { id } }: Props) {
  return (
    <div className="relative h-full">
      <Comments rootId={Number(id)} type="CHALLENGE" expanded />
    </div>
  );
}

import { Button } from '~/components/ui/button';
import Comment from '~/components/ui/comment';
import type { Challenge } from '.';

interface Props {
  challenge: NonNullable<Challenge>;
}

const Comments = ({ challenge }: Props) => {
  return (
    <div className="flex h-full w-full flex-col py-4">
      <div className="flex-1 flex-grow">
        {challenge.comment.map((comment) => (
          <Comment
            key={comment.id}
            userId={comment.user.name ?? ''}
            text={comment.text}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
      <Button className="sticky bottom-4 right-4 max-w-fit self-end">Comment</Button>
    </div>
  );
};

export default Comments;

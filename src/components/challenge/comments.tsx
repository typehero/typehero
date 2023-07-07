import type { ChallengeComment } from '@prisma/client';
import { Button } from '~/components/ui/button';
import Comment from '~/components/ui/comment';

// type Props = {
//   comments: ChallengeComment[];
// };

const comments: ChallengeComment[] = [
  {
    id: 0,
    userId: 'me',
    challengeId: 1,
    text: 'This is a comment',
  },
  {
    id: 1,
    userId: 'you',
    challengeId: 1,
    text: 'This challenge sucks',
  },
];

const Comments = () => {
  return (
    <div className="flex h-full w-full flex-col py-4">
      <div className="flex-1 flex-grow">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            userId={comment.userId}
            challengeId={comment.challengeId}
            text={comment.text}
          />
        ))}
      </div>
      <Button className="sticky bottom-4 right-4 max-w-fit self-end">Comment</Button>
    </div>
  );
};

export default Comments;

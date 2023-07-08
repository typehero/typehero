import clsx from 'clsx';
import { Button } from '~/components/ui/button';
import Comment from '~/components/ui/comment';
import { type Challenge } from '~/app/challenge/[id]/page';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';
import NoComments from './nocomments';

interface Props {
  challenge: NonNullable<Challenge>;
}

const Comments = ({ challenge }: Props) => {
  const [showComments, setShowComments] = useState(false);
  const handleClick = () => {
    setShowComments(!showComments);
  };
  return (
    <div className="relative">
      <button
        className="flex w-full items-center justify-between gap-2 p-3 font-medium text-neutral-500 duration-300 hover:text-neutral-700 dark:hover:text-zinc-300"
        onClick={() => handleClick()}
      >
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5"></MessageCircle>
          &nbsp; Comments
        </div>
        <ChevronDown
          className={clsx('h-4 w-4 duration-300', {
            '-rotate-180': !showComments,
          })}
        ></ChevronDown>
      </button>
      <div
        className={clsx('overscroll-contain duration-300', {
          'h-64 overflow-y-auto': showComments,
          'h-0 overflow-y-hidden': !showComments,
        })}
      >
        {challenge.comment.length === 0 && <NoComments></NoComments>}
        {challenge.comment.map((comment) => (
          <Comment
            key={comment.id}
            userId={comment.user.name ?? ''}
            text={comment.text}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
      <div className="m-2 mt-0 flex items-center justify-between gap-2 rounded-xl bg-background/90 bg-neutral-100 p-1 pr-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
        <Input
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Enter your comment here."
        />
        <Button className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300">
          Comment
        </Button>
      </div>
    </div>
  );
};

export default Comments;

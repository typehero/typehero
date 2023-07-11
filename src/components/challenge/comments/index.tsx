'use client';

import clsx from 'clsx';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import Comment from '~/components/challenge/comments/comment';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/use-toast';
import { Input } from '~/components/ui/input';
import NoComments from '../nocomments';
import { addChallengeComment } from './comment.action';

interface Props {
  challenge: ChallengeRouteData;
}

const Comments = ({ challenge }: Props) => {
  // State
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState('');
  const router = useRouter();

  // Functions
  const handleClick = () => {
    setShowComments(!showComments);
  };

  async function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      await createChallengeComment();
    }
  }

  async function createChallengeComment() {
    try {
      const res = await addChallengeComment(challenge.id, text);
      if (res === 'text_is_empty') {
        toast({
          title: 'Empty Comment',
          description: <p>You cannot post an empty comment.</p>,
        });
      } else if (res === 'unauthorized') {
        toast({
          title: 'Unauthorized',
          description: <p>You need to be signed in to post a comment.</p>,
        });
      }
      setText('');
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="relative">
      <button
        className="flex w-full items-center justify-between gap-2 p-3 font-medium text-neutral-500 duration-300 hover:text-neutral-700 dark:hover:text-zinc-300"
        onClick={() => handleClick()}
      >
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5"></MessageCircle>
          &nbsp; Comments ({challenge.comment.length})
        </div>
        <ChevronDown
          className={clsx('h-4 w-4 duration-300', {
            '-rotate-180': !showComments,
          })}
        ></ChevronDown>
      </button>
      <div
        className={clsx('flex flex-col-reverse overscroll-contain duration-300', {
          'h-64 overflow-y-auto': showComments,
          'h-0 overflow-y-hidden': !showComments,
        })}
      >
        {challenge.comment.length === 0 && <NoComments></NoComments>}
        {challenge.comment.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      <div className="m-2 mt-0 flex items-center justify-between gap-2 rounded-xl bg-background/90 bg-neutral-100 p-1 pr-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyUp={handleEnterKey}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Enter your comment here."
        />
        <Button
          onClick={createChallengeComment}
          className="h-8 rounded-lg bg-emerald-600 px-3 py-2 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default Comments;

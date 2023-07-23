import { type DialogTriggerProps } from '@radix-ui/react-dialog';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { TypographyP } from '~/components//ui/paragraph';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { TypographyLarge } from '~/components/ui/typography/large';
import { toast } from '~/components/ui/use-toast';
import { getRelativeTime } from '~/utils/relativeTime';
import { deleteComment } from '../comment.action';

interface CommentDeleteDialogProps extends DialogTriggerProps {
  comment: ChallengeRouteData['comment'][number];
}

export const CommentDeleteDialog = ({ children, comment, ...props }: CommentDeleteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  async function handleDeleteComment() {
    try {
      await deleteComment(comment.id);
      toast({
        title: 'Comment Deleted',
        variant: 'success',
        description: 'The comment was successfully deleted.',
      });
    } catch (e) {
      // todo: log on a dump service.
      console.log(e);
      toast({
        title: 'Uh Oh!',
        variant: 'destructive',
        description: 'An error occurred while trying to delete the comment.',
      });
    } finally {
      queryClient.invalidateQueries(['comments', comment.rootChallengeId]);
      setIsOpen(!isOpen);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger {...props}>{children}</DialogTrigger>
      <DialogContent className="flex flex-col space-y-2">
        <TypographyLarge>Are you sure?</TypographyLarge>

        <div className="flex flex-col gap-1 p-3 pt-2">
          <div className="flex items-start justify-between pr-[0.4rem]">
            <div className="flex items-center gap-1">
              <span className="-ml-[0.33rem] flex h-auto w-fit items-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 hover:bg-black/10 dark:text-white dark:hover:bg-white/20">
                @{comment.user.name}
              </span>
              <Tooltip delayDuration={0.05}>
                <TooltipTrigger asChild>
                  <span className="mr-2 whitespace-nowrap text-sm text-neutral-500">
                    {getRelativeTime(comment.createdAt)}
                  </span>
                </TooltipTrigger>
                <TooltipContent align="start" className="rounded-xl">
                  <span className="text-white-500 text-xs">
                    {comment.createdAt.toLocaleString()}
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <p className="w-full break-words pl-[1px] text-sm">
            {/* TODO: <code></code> is <Markdown /> does not wrap long lines causing overflow */}
            {/* <Markdown>{comment.text}</Markdown> */}
            {comment.text}
          </p>
        </div>
        <TypographyP>The following comment will be permanently deleted.</TypographyP>
        <div className="flex flex-row gap-2">
          <Button variant={'outline'} onClick={() => setIsOpen(!isOpen)}>
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => {
              void handleDeleteComment();
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDeleteDialog;

import type { DialogTriggerProps } from '@radix-ui/react-dialog';
import { Button } from '@repo/ui/components/button';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import { Markdown } from '@repo/ui/components/markdown';
import { TypographyP } from '@repo/ui/components/paragraph';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { TypographyLarge } from '@repo/ui/components/typography/large';
import { toast } from '@repo/ui/components/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getRelativeTime } from '~/utils/relativeTime';
import { deleteComment } from '../comment.action';
import { type PaginatedComments } from '../getCommentRouteData';

interface CommentDeleteDialogProps extends DialogTriggerProps {
  comment: PaginatedComments['comments'][number];
  queryKey?: (number | string)[];
}

export function CommentDeleteDialog({
  children,
  comment,
  queryKey,
  ...props
}: CommentDeleteDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  async function handleDeleteComment() {
    try {
      const res = await deleteComment(comment.id, comment.userId);
      if (res === 'unauthorized') {
        toast({
          title: 'Unauthorized',
          description: <p>You need to be signed in to post a comment.</p>,
        });
      } else {
        toast({
          title: 'Comment Deleted',
          variant: 'success',
          description: 'The comment was successfully deleted.',
        });
      }
    } catch (e) {
      // todo: log on a dump service.
      console.log(e);
      toast({
        title: 'Uh Oh!',
        variant: 'destructive',
        description: 'An error occurred while trying to delete the comment.',
      });
    } finally {
      queryClient.invalidateQueries(queryKey);
      setIsOpen(!isOpen);
    }
  }

  return (
    <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
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
          <div className="w-full break-words pl-[1px] text-sm">
            <Markdown>{comment.text}</Markdown>
          </div>
        </div>
        <TypographyP>The following comment will be permanently deleted.</TypographyP>
        <div className="flex flex-row gap-2">
          <Button onClick={() => setIsOpen(!isOpen)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              void handleDeleteComment();
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

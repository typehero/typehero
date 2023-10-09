import type { DialogTriggerProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import { TypographyLarge } from '@repo/ui/components/typography/large';
import type { ChallengeSolution } from '~/app/[locale]/challenge/[id]/solutions/[solutionId]/page';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { getRelativeTime } from '~/utils/relativeTime';
import { Button } from '@repo/ui/components/button';
import { TypographyP } from '@repo/ui/components/paragraph';
import { Markdown } from '@repo/ui/components/markdown';
import { Label } from '@repo/ui/components/label';
import { deleteSolution } from '../_actions';
import { toast } from '@repo/ui/components/use-toast';
import { useRouter } from 'next/navigation';

interface SolutionDeleteDialogProps extends DialogTriggerProps {
  solution: ChallengeSolution;
}

export function SolutionDeleteDialog({ children, solution, ...props }: SolutionDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleDeleteSolution() {
    try {
      await deleteSolution(solution.id, solution.challengeId ?? 0);
      toast({
        title: 'Solution Deleted',
        variant: 'success',
        description: 'The solution was successfully deleted.',
      });
      router.back();
    } catch (e) {
      toast({
        title: 'Uh Oh!',
        variant: 'destructive',
        description: 'An error occurred while trying to delete the comment.',
      });
    }
  }

  return (
    <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
      <DialogTrigger {...props}>{children}</DialogTrigger>
      <DialogContent className="flex flex-col space-y-2">
        <TypographyLarge>Are you sure?</TypographyLarge>
        <div className="flex flex-col gap-1 p-3">
          <div className="flex items-start justify-between pr-[0.4rem]">
            <div className="mb-2 flex items-center gap-1">
              <span className="-ml-[0.33rem] flex h-auto w-fit items-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 hover:bg-black/10 dark:text-white dark:hover:bg-white/20">
                @{solution?.user?.name}
              </span>
              <Tooltip delayDuration={0.05}>
                <TooltipTrigger asChild>
                  <span className="mr-2 whitespace-nowrap text-sm text-neutral-500">
                    {getRelativeTime(solution.createdAt)}
                  </span>
                </TooltipTrigger>
                <TooltipContent align="start" className="rounded-xl">
                  <span className="text-white-500 text-xs">
                    {solution.createdAt.toLocaleString()}
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Label className="mt-2 text-neutral-500">Title:</Label>
          <TypographyLarge>{solution.title}</TypographyLarge>
          <Label className="mt-2 text-neutral-500">Solution:</Label>
          <div className="max-h-48 overflow-y-scroll">
            <Markdown>{solution.description}</Markdown>
          </div>
        </div>
        <TypographyP>The following solution will be permanently deleted.</TypographyP>
        <div className="flex flex-row gap-2">
          <Button onClick={() => setIsOpen(!isOpen)} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              void handleDeleteSolution();
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

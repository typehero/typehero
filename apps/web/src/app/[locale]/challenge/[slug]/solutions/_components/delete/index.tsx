import type { DialogTriggerProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/components/dialog';
import { TypographyLarge } from '@repo/ui/components/typography/large';
import type { ChallengeSolution } from '~/app/[locale]/challenge/[slug]/solutions/[solutionId]/page';
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
      await deleteSolution(solution);
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
        <TypographyLarge>Delete solution</TypographyLarge>
        <TypographyP>Are you sure you want to delete this solution?</TypographyP>
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

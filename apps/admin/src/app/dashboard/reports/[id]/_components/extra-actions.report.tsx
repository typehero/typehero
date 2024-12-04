import type { ReportWithInfo } from '../_actions';
import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/use-toast';
import router from 'next/router';
import { banChallenge, deleteComment, deleteSolution } from '../_actions';

export const ExtraActionsButton = ({ report }: { report: ReportWithInfo }) => {
  async function handleDeleteComment(commentId: number, reportId: number) {
    try {
      await deleteComment(commentId, reportId);
      toast({
        title: 'Success',
        description: <p>Comment deleted successfully</p>,
      });
      router.push('/?tab=reports');
    } catch {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later.</p>,
      });
    }
  }
  async function handleDisableChallenge(challengeId: number, reportId: number) {
    try {
      await banChallenge(challengeId, reportId);
      router.push('/?tab=reports');
    } catch {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later</p>,
      });
    }
  }
  async function handleRemoveSolution(solutionId: number) {
    const response = await deleteSolution(solutionId, report.id);
    if (response === 'ok') {
      toast({
        title: 'Successfully removed solution',
      });
      router.push('/?tab=reports');
    } else {
      toast({
        title: 'Error',
        description: <p>Something has gone wrong. Please try again later.</p>,
      });
    }
  }
  switch (report.type) {
    case 'CHALLENGE':
      return (
        <Button
          disabled={report.moderatorId !== null}
          onClick={() => handleDisableChallenge(report.challengeId!, report.id)}
        >
          Disable Challenge
        </Button>
      );

    case 'SOLUTION':
      return (
        <Button
          disabled={report.moderator !== null}
          onClick={() => handleRemoveSolution(report.solutionId!)}
        >
          Remove Solution
        </Button>
      );

    case 'COMMENT':
      return (
        <Button
          disabled={report.moderatorId !== null}
          onClick={() => handleDeleteComment(report.commentId!, report.id)}
          variant="destructive"
        >
          Delete Comment
        </Button>
      );
    default:
      return null;
  }
};

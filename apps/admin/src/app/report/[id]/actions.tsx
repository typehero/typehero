'use client';

import { type User } from '@repo/db/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  banChallenge,
  banUser,
  deleteComment,
  deleteSolution,
  dismissReport,
} from '../../_components/admin.actions';
import { type ReportWithInfo } from './report.action';
import { toast } from '@repo/ui/components/use-toast';
import { Button } from '@repo/ui/components/button';
import { Label } from '@repo/ui/components/label';
import { Textarea } from '@repo/ui/components/textarea';

export interface ReportActionsProps {
  report: NonNullable<ReportWithInfo>;
}
// export type ReportActionsProps = UserReportActionProps | ChallengeReportActionProps | SolutionReportActionProps | CommentReportActionProps;

export interface ReportActionsBase {
  moderator?: User;
  user: User;
}

export function ReportActions({ report }: ReportActionsProps) {
  const [banReason, setBanReason] = useState('');
  const [ban, setBan] = useState(false);
  const router = useRouter();

  const user = useMemo(() => {
    switch (report.type) {
      case 'USER':
        return report.user;
      case 'CHALLENGE':
        return report.challenge?.user;
      case 'COMMENT':
        return report.comment?.user;
      case 'SOLUTION':
        return report.solution?.user;
    }
  }, [report]);

  async function handleDeleteComment(commentId: number, reportId: number) {
    try {
      await deleteComment(commentId, reportId);
      toast({
        title: 'Success',
        description: <p>Comment deleted successfully</p>,
      });
      router.push('/?tab=reports');
    } catch (e) {
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
    } catch (e) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later</p>,
      });
    }
  }

  async function handleBanUser(userId: string, reportId: number, banReason?: string) {
    try {
      await banUser(report.userId!, reportId, banReason);
      toast({
        title: 'Success',
        description: <p>User banned successfully.</p>,
      });
      router.push('/?tab=reports');
    } catch (e) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later</p>,
      });
    }
  }

  async function handleDismissReport(reportId: number) {
    try {
      await dismissReport(reportId);
      toast({
        title: 'Success',
        description: <p>Dismissed successfully.</p>,
      });
      router.push('/?tab=reports');
    } catch (e) {
      console.error(e);
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

  return (
    <div className="flex gap-2">
      <Button
        disabled={report.moderatorId !== null}
        onClick={() => setBan(true)}
        variant="destructive"
      >
        Ban @{user?.name ?? 'unknown user'}
      </Button>

      {report.type === 'CHALLENGE' && (
        <Button
          disabled={report.moderatorId !== null}
          onClick={() => handleDisableChallenge(report.challengeId!, report.id)}
        >
          Disable Challenge
        </Button>
      )}

      {report.type === 'SOLUTION' && (
        <Button
          disabled={report.moderator !== null}
          onClick={() => handleRemoveSolution(report.solutionId!)}
        >
          Remove Solution
        </Button>
      )}

      {report.type === 'COMMENT' && (
        <Button
          disabled={report.moderatorId !== null}
          onClick={() => handleDeleteComment(report.commentId!, report.id)}
          variant="destructive"
        >
          Delete Comment
        </Button>
      )}

      <Button disabled={report.moderatorId !== null} onClick={() => handleDismissReport(report.id)}>
        Dismiss Report
      </Button>

      <Dialog onOpenChange={() => setBan(false)} open={ban}>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBanUser('', report.id, banReason);
            }}
          >
            <DialogHeader>
              <DialogTitle>Ban Reason</DialogTitle>
              <DialogDescription>
                Give some details for why the user is being banned
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                onChange={(e) => setBanReason(e.target.value)}
                value={banReason}
              />
            </div>
            <DialogFooter>
              <Button onClick={() => setBan(false)} type="button" variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Ban
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

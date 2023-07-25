'use client';

import { type User } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '~/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  banUser,
  deleteComment,
  deleteSolution,
  banChallenge,
  dismissReport,
} from '~/components/admin/admin.actions';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';
import { type ReportWithInfo } from './report.action';

export interface ReportActionsProps {
  report: NonNullable<ReportWithInfo>;
}
// export type ReportActionsProps = UserReportActionProps | ChallengeReportActionProps | SolutionReportActionProps | CommentReportActionProps;

export interface ReportActionsBase {
  moderator?: User;
  user: User;
}

export default function ReportActions({ report }: ReportActionsProps) {
  const [banReason, setBanReason] = useState('');
  const [ban, setBan] = useState(false);
  const router = useRouter();

  const user = useMemo(() => {
    switch (report.type) {
      case 'USER':
        return report.user as User;
      case 'CHALLENGE':
        return report?.challenge?.user as User;
      case 'COMMENT':
        return report?.comment?.user as User;
      case 'SOLUTION':
        return report.solution?.user as User;
    }
  }, [report]);

  async function handleDeleteComment(commentId: number, reportId: number) {
    try {
      await deleteComment(commentId, reportId);
      toast({
        title: 'Success',
        description: <p>Comment deleted successfully</p>,
      });
      router.push('/admin');
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
      router.push('/admin');
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
      await banUser(report.userId as string, reportId, banReason);
      toast({
        title: 'Success',
        description: <p>User banned successfully.</p>,
      });
      router.push('/admin');
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
      router.push('/admin');
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
      router.push('/admin');
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
        variant="destructive"
        disabled={report.moderatorId !== null}
        onClick={() => setBan(true)}
      >
        Ban @{user.name}
      </Button>

      {report.type === 'CHALLENGE' && (
        <Button
          disabled={report.moderatorId !== null}
          onClick={() => handleDisableChallenge(report.challengeId as number, report.id)}
        >
          Disable Challenge
        </Button>
      )}

      {report.type === 'SOLUTION' && (
        <Button
          disabled={report.moderator !== null}
          onClick={() => handleRemoveSolution(report.solutionId as number)}
        >
          Remove Solution
        </Button>
      )}

      {report.type === 'COMMENT' && (
        <Button
          disabled={report.moderatorId !== null}
          onClick={() => handleDeleteComment(report.commentId as number, report.id)}
          variant="destructive"
        >
          Delete Comment
        </Button>
      )}

      <Button disabled={report.moderatorId !== null} onClick={() => handleDismissReport(report.id)}>
        Dismiss Report
      </Button>

      <Dialog open={ban} onOpenChange={() => setBan(false)}>
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
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setBan(false)}>
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

'use client';

import { type Challenge, type User, type Vote } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '~/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  banUser,
  disableChallenge,
  dismissChallengeReport,
} from '~/components/admin/admin.actions';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { toast } from '~/components/ui/use-toast';

export default function ReportActions({
  moderatorId,
  challenge,
  reportId,
}: {
  moderatorId: string | null;
  moderator: { name: string | null } | null;
  challenge: Challenge & { user: User; vote: Vote[] };
  reportId: number;
}) {
  const [banReason, setBanReason] = useState('');
  const [ban, setBan] = useState(false);
  const router = useRouter();

  async function handleDisableChallenge(challengeId: number, reportId: number) {
    try {
      await disableChallenge(challengeId, reportId);
    } catch (e) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later.s</p>,
      });
    }
  }

  async function handleBanUser(userId: string, reportId: number, banReason?: string) {
    try {
      await banUser(userId, reportId, banReason);
      toast({
        title: 'Success',
        description: <p>User banned successfully.</p>,
      });
      router.push('/admin');
    } catch (e) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later.s</p>,
      });
    }
  }

  async function handleDismissReport(reportId: number) {
    try {
      await dismissChallengeReport(reportId);
      toast({
        title: 'Success',
        description: <p>Dismissed successfully.</p>,
      });
      router.push('/admin');
    } catch (e) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: <p>An error occurred. Please try again later.s</p>,
      });
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="destructive" disabled={moderatorId !== null} onClick={() => setBan(true)}>
        Ban @{challenge.user.name}
      </Button>
      <Button
        disabled={moderatorId !== null}
        onClick={() => handleDisableChallenge(challenge.id, reportId)}
      >
        Disable Challenge
      </Button>
      <Button disabled={moderatorId !== null} onClick={() => handleDismissReport(reportId)}>
        Dismiss Report
      </Button>
      <Dialog open={ban} onOpenChange={() => setBan(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBanUser(challenge.user.id, reportId, banReason);
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

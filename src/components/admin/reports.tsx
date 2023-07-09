'use client';

import { formatDistance } from 'date-fns';
import { EyeOff, Gavel, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  banUser,
  disableChallenge,
  dismissChallengeReport,
  type AdminReportDetails,
} from '~/components/admin/admin.actions';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Markdown } from '../ui/markdown';
import { TypographyP } from '../ui/paragraph';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { TypographyH3 } from '../ui/typography/h3';
import { toast } from '../ui/use-toast';

interface ReportsProps {
  data: AdminReportDetails;
}
export const ReportDetails = ({ data }: ReportsProps) => {
  // State
  const router = useRouter();
  const session = useSession();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<AdminReportDetails[number]>();
  const [banReason, setBanReason] = useState('');
  const handledReports = data.filter((report) => report.moderatorId === session.data?.user.id);
  // todo: will add them to a dropdown later.
  const [isDismissedHidden, setIsDismissedHidden] = useState(false);
  const [isClearedHidden, setIsClearedHidden] = useState(false);

  // Functions
  async function handleUserBan() {
    try {
      if (selectedIssue) {
        const username = selectedIssue.challenge.user.name;
        await banUser(selectedIssue?.challenge.userId, selectedIssue?.id, banReason);

        toast({
          title: 'Success',
          description: <p>The user {username ? '@' + username + ' ' : ''}successfully banned.</p>,
          variant: 'success',
        });
      }
    } catch (e) {
    } finally {
      router.refresh();
      setDialogOpen(false);
    }
  }

  async function handleDisableChallenge() {
    try {
      if (selectedIssue) {
        await disableChallenge(selectedIssue?.challengeId, selectedIssue?.id);
        toast({
          title: 'Success',
          description: <p>The challenge was successfully disabled.</p>,
          variant: 'success',
        });
      }
    } catch (e) {
      toast({
        title: 'Something went wrong.',
        description: <p>An error was encountered while trying to disable the challenge</p>,
        variant: 'destructive',
      });
    } finally {
      router.refresh();
      setDialogOpen(false);
    }
  }

  async function handleDismissReport() {
    try {
      if (selectedIssue) {
        await dismissChallengeReport(selectedIssue.id);
      }
    } catch (e) {
    } finally {
      router.refresh();
      setDialogOpen(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col justify-start gap-4 rounded-md border-2 p-5 md:flex-row md:items-center">
        <TypographyH3>Statistics</TypographyH3>
        <span className="text-sm text-neutral-400 dark:text-neutral-600">
          <strong>{data.length}</strong> reports.
        </span>
        <span className="text-sm text-neutral-400 dark:text-neutral-600">
          <strong>{handledReports.length}</strong> reports handled by you.
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Challenge Name</TableHead>
            <TableHead>Reported By</TableHead>
            <TableHead>At</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((report, reportIdx) => {
            // 1. Checks.
            if (isDismissedHidden && report.status === 'DISMISSED') return;
            if (isClearedHidden && report.status === 'CLEARED') return;

            // 2. Local State
            const challengeName = report.challenge.name;
            const text = report.text;
            const relativeTime = formatDistance(report.createdAt, Date.now(), {
              addSuffix: true,
              includeSeconds: true,
            });
            const absoluteTime = new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            }).format(report.createdAt);

            return (
              <TableRow
                onClick={() => {
                  setSelectedIssue(report);
                  setDialogOpen(true);
                }}
                className="hover:cursor-pointer"
                key={reportIdx}
              >
                <TableCell title={challengeName}>
                  {challengeName.length > 10
                    ? challengeName.substring(0, 10) + '...'
                    : challengeName}
                </TableCell>
                <TableCell>@{report.author.name}</TableCell>
                <TableCell title={absoluteTime}>{relativeTime}</TableCell>
                <TableCell title={text}>
                  {text.length > 15 ? text.substring(0, 10) : text}
                </TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  {report.derogatory && <Badge variant="destructive">Derogatory</Badge>}
                  {report.unclear && <Badge variant="outline">Unclear</Badge>}
                </TableCell>
                <TableCell>
                  {report.status === 'PENDING' && <Badge variant="secondary">Pending</Badge>}
                  {report.status === 'DISMISSED' && <Badge variant="outline">Dismissed</Badge>}
                  {report.status === 'CLEARED' && <Badge>Cleared</Badge>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={(e) => setDialogOpen(!e)}>
        {/* max-w-xl is not the best solution, the dialog width need fixing with the markdown. */}
        <DialogContent className="max-w-xl">
          <ScrollArea className="h-[500px]">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge</CardTitle>
                  <CardDescription>A detailed description of the challenge.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-2">
                      <h5 className="text-sm text-neutral-400 dark:text-neutral-600">Name</h5>
                      <TypographyP>{selectedIssue?.challenge.name}</TypographyP>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h5 className="text-sm text-neutral-400 dark:text-neutral-600">
                        Description
                      </h5>
                      <div className="prose-invert flex-1 leading-8 prose-h3:text-xl">
                        {/* todo: fix the width overflow because of markdown component. */}

                        <Markdown>
                          {selectedIssue?.challenge.description ?? 'Not Specified.'}
                        </Markdown>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h5 className="text-sm text-neutral-400 dark:text-neutral-600">Created By</h5>
                      <TypographyP>@{selectedIssue?.challenge.user.name}</TypographyP>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Report</CardTitle>
                  <CardDescription>A detailed description of the report.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-2">
                      <h5 className="text-sm text-neutral-400 dark:text-neutral-600">Reason</h5>
                      <TypographyP>
                        {selectedIssue?.text && selectedIssue.text.length > 0
                          ? selectedIssue.text
                          : 'Not Specified.'}
                      </TypographyP>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h5 className="text-sm text-neutral-400 dark:text-neutral-600">Tags</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedIssue?.derogatory && (
                          <Badge variant="destructive">Derogatory</Badge>
                        )}
                        {selectedIssue?.unclear && <Badge variant="outline">Unclear</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {selectedIssue?.moderator && (
                <Card>
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                    <CardDescription>An account of activity on the report.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-2">
                        <h5 className="text-sm text-neutral-400 dark:text-neutral-600">
                          Handled By
                        </h5>
                        <TypographyP>@{selectedIssue.moderator.name}</TypographyP>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <h5 className="text-sm text-neutral-400 dark:text-neutral-600">At</h5>
                        <div className="flex">
                          {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'medium',
                          }).format(selectedIssue.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ban_reason">Ban Reason</Label>
                  <Textarea
                    className="max-w-xl"
                    id="ban_reason"
                    placeholder="An optional ban reason..."
                    value={banReason}
                    onChange={(e) => {
                      setBanReason(e.target.value);
                    }}
                  />
                </div>
                <Button
                  variant={'destructive'}
                  onClick={handleUserBan}
                  className="flex items-center justify-center gap-2"
                >
                  <Gavel className="h-4 w-4" />
                  Ban @{selectedIssue?.challenge.user.name}
                </Button>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      handleDisableChallenge();
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <EyeOff className="h-4 w-4" />
                    Disable Challenge
                  </Button>
                  <Button
                    onClick={handleDismissReport}
                    className="flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Dismiss Report
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

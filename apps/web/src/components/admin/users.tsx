'use client';

import { useRouter } from 'next/navigation';
import { Unlock } from 'lucide-react';
import { ActionMenu } from '../ui/action-menu';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TypographyH3 } from '../ui/typography/h3';
import { toast } from '../ui/use-toast';
import { getRelativeTime } from '~/utils/relativeTime';
import { unbanUser, type AdminBannedUsers } from '~/components/admin/admin.actions';

interface BannedUsersProps {
  data: AdminBannedUsers;
}

export function BannedUsers({ data }: BannedUsersProps) {
  // State
  const router = useRouter();

  // Functions
  async function handleUserUnban(user: (typeof data)[number]) {
    try {
      await unbanUser(user.id);
      toast({
        title: 'Unbanned',
        description: `The user @${user.name} was successfully unbanned.`,
      });
    } catch (e) {
      toast({
        title: 'Something went wrong.',
        variant: 'destructive',
        description: `The user @${user.name} could not be unbanned.`,
      });
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col justify-start gap-4 rounded-md border-2 p-5 md:flex-row md:items-center">
        <TypographyH3>Statistics</TypographyH3>
        <span className="text-sm text-neutral-400 dark:text-neutral-600">
          <strong>{data.length}</strong> total bans.
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>At</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user, userIdx) => {
            const username = user.name;
            const status = user.status;
            const relativeTime = getRelativeTime(user.updatedAt);
            const absoluteTime = new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            }).format(user.updatedAt);
            const banReason = user.banReason;
            return (
              <TableRow key={userIdx}>
                <TableCell title={username ?? ''}>@{username}</TableCell>
                <TableCell>
                  <Badge>{status}</Badge>
                </TableCell>
                <TableCell title={absoluteTime}>{relativeTime}</TableCell>
                <TableCell title={banReason ?? ''}>
                  {banReason
                    ? banReason.length > 15
                      ? banReason.substring(0, 10)
                      : banReason
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <ActionMenu
                    items={[
                      {
                        key: 'unban',
                        label: 'Unban',
                        icon: Unlock,
                      },
                    ]}
                    onChange={(item) => {
                      if (item.key === 'unban') {
                        // any better workarounds for void?
                        handleUserUnban(user);
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

'use client';

import { type User } from '@repo/db/types';
import { Flag } from '@repo/ui/icons';
import { ActionMenu, Text } from '@repo/ui';
import ReportDialog from '~/components/report';

export interface UserHeaderProps {
  user: User;
}

export default function UserHeader({ user }: UserHeaderProps) {
  return (
    <div className="flex gap-4">
      <Text intent="h1">{user.name}</Text>
      <ReportDialog reportType="USER" userId={user.id}>
        <ActionMenu
          items={[
            {
              key: 'report',
              label: 'Report',
              icon: Flag,
            },
          ]}
          onChange={() => {
            // do nothing
          }}
        />
      </ReportDialog>
    </div>
  );
}

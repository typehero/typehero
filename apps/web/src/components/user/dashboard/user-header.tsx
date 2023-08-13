'use client';

import { type User } from '@repo/db/types';
import { Flag } from 'lucide-react';
import Text from '~/components/ui/typography/typography';
import ReportDialog from '~/components/report';
import { ActionMenu } from '~/components/ui/action-menu';

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

'use client';
import { ActionMenu } from '@repo/ui/components/action-menu';
import { Flag } from '@repo/ui/icons';
import React from 'react';
import { ReportDialog } from '~/components/ReportDialog';
import type { ChallengeProps } from '.';

export function Report({ challenge }: ChallengeProps) {
  return (
    <ReportDialog challengeId={challenge.id} reportType="CHALLENGE">
      <ActionMenu
        items={[
          {
            key: 'feedback',
            label: 'Feedback',
            icon: Flag,
          },
        ]}
        onChange={() => {
          // do nothing
        }}
      />
    </ReportDialog>
  );
}

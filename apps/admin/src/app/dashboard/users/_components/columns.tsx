'use client';

import { Button } from '@repo/ui/components/button';
import { type ColumnDef } from '@tanstack/react-table';
import { unbanUser, type BannedUsers } from '../_actions';

export const columns: ColumnDef<BannedUsers[0]>[] = [
  {
    accessorKey: 'name',
    header: 'Username',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Date',
    cell: ({ row }) => {
      const absoluteTime = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(row.original.updatedAt);
      return <pre>{absoluteTime}</pre>;
    },
  },
  {
    accessorKey: 'banReason',
    header: 'Reason',
  },
  {
    header: '...',
    cell: ({ row }) => {
      return (
        <Button
          variant="outline"
          onClick={async () => {
            await unbanUser(row.original.id);
          }}
        >
          Unban
        </Button>
      );
    },
  },
];

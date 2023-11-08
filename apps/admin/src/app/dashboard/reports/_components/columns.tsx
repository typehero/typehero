'use client';

import { type ColumnDef } from '@tanstack/react-table';
import type { AdminReport } from '../_actions';
import Link from 'next/link';
import { Button } from '@repo/ui/components/button';

export const columns: ColumnDef<AdminReport>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'reporter',
    header: 'Reporter',
    cell: ({ row }) => {
      return <pre>{row.original.reporter.name}</pre>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'text',
    header: 'Info',
  },
  {
    accessorKey: 'issues',
    header: 'Tags',
    cell: ({ row }) => {
      return <pre>{row.original.issues.map((i) => i.type).join(', ')}</pre>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return <pre>{row.original.createdAt.toDateString()}</pre>;
    },
  },
  {
    header: '...',
    cell: ({ row }) => {
      return (
        <Link href={`reports/${row.original.id}`}>
          <Button variant="link">Manage</Button>
        </Link>
      );
    },
  },
];

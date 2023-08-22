'use client';

import type { Track, TrackChallenge } from '@repo/db/types';
import { Button } from '@repo/ui';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<Track & { trackChallenges: TrackChallenge[] }>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'visible',
    header: 'Visible',
    cell: (info) => (info.getValue() ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'trackChallenges',
    header: 'No. of challenges',
    cell: ({ row }) => {
      console.log({ row: row.original });
      return <pre>{row.original.trackChallenges?.length ?? 0}</pre>;
    },
  },
  {
    header: '...',
    cell: ({ row }) => {
      return (
        <Link href={`tracks/${row.original.id}`}>
          <Button variant="link">Manage</Button>
        </Link>
      );
    },
  },
];

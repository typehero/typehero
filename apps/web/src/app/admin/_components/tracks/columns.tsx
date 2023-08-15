'use client';

import type { Track } from '@repo/db/types';
import { type ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Track>[] = [
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
    cell: ({ cell, row }) => {
      console.log({ og: row.original });

      // @ts-ignore
      return <pre>{row.original.trackChallenges?.length ?? 0}</pre>;
    },
  },
];

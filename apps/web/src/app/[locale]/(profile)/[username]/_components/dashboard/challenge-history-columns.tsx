'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { getRelativeTime } from '~/utils/relativeTime';
import type { HistoricalChallenge } from './_actions';

export const columns: ColumnDef<HistoricalChallenge>[] = [
  {
    accessorKey: 'slug',
    header: 'Challenge',
    cell: ({ row }) => (
      <Link href={`/challenge/${row.original.slug}`} className="underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'submissionDate',
    header: 'Last Submission',
    cell: ({ row }) => getRelativeTime(row.original.submissionDate!),
  },
];

'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import type { HistoricalChallenge } from '~/app/actions/badges/_actions';

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
    cell: ({ row }) => getRelativeTimeStrict(row.original.submissionDate!),
  },
];

'use client';

import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { getRelativeTime } from '~/utils/relativeTime';

export interface Challenge {
  id: number;
  name: string;
  slug: string;
  submission: {
    createdAt: Date;
  }[];
}

export const columns: ColumnDef<Challenge>[] = [
  {
    accessorKey: 'challenge',
    header: 'Challenge',
    cell: ({ row }) => <Link href={`/challenge/${row.original.slug}`}>{row.original.name}</Link>,
  },
  {
    accessorKey: 'lastSubmission',
    header: 'Last Submission',
    cell: ({ row }) => getRelativeTime(row.original.submission[0]!.createdAt),
  },
];

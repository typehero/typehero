'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { getRelativeTime } from '~/utils/relativeTime';
import Link from 'next/link';
import type { SharedSolution } from '../page';

export const sharedSolutionsColumns: ColumnDef<SharedSolution>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link
        className="underline"
        href={`/challenge/${row.original.challenge?.slug}/solutions/${row.original.id}`}
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorFn: (solution) => solution.challenge?.name,
    header: 'Challenge',
    cell: ({ row }) => (
      <Link className="underline" href={`/challenge/${row.original.challenge?.slug}`}>
        {row.original.challenge?.name}
      </Link>
    ),
  },
  {
    accessorFn: (solution) => solution._count.vote,
    header: 'Votes',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => getRelativeTime(row.original.createdAt),
  },
];

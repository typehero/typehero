'use client';

import type { Challenge } from '@repo/db/types';
import { Button } from '@repo/ui';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<Challenge>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
  },
  {
    accessorKey: 'shortDescription',
    header: 'Description',
  },
  {
    accessorKey: 'user.name',
    header: 'Created By',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created On',
    cell: (info) => new Date(info.getValue() as Date).toLocaleDateString(),
  },
  {
    header: '...',
    cell: ({ row }) => {
      return (
        <Link href={`admin/challenge/${row.original.id}`}>
          <Button variant="link">Manage</Button>
        </Link>
      );
    },
  },
];

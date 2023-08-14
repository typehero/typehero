'use client';

import type { Track } from '@repo/db/types';
import { type ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Track>[] = [
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
];

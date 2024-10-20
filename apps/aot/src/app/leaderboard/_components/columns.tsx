'use client';

import { createColumnHelper } from '@tanstack/react-table';

export interface OverallLeaderboardEntry {
  totalPoints: number;
  name: string;
}

const columnHelper = createColumnHelper<OverallLeaderboardEntry>();

export const columns = [
  columnHelper.display({
    id: 'ranking',
    cell: (props) => props.row.index,
  }),
  columnHelper.accessor('totalPoints', {
    cell: (info) => Number(info.getValue()),
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
  }),
];

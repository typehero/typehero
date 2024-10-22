'use client';

import { createColumnHelper } from '@tanstack/react-table';

/*
 *  Overall Leaderboard Table Columns
 */

export interface OverallLeaderboardEntry {
  totalPoints: number;
  name: string;
}

const overallLeaderboardColumnHelper = createColumnHelper<OverallLeaderboardEntry>();

export const overallLeaderboardColumns = [
  overallLeaderboardColumnHelper.display({
    id: 'ranking',
    header: '#',
    cell: (props) => props.row.index + 1,
  }),
  overallLeaderboardColumnHelper.accessor('totalPoints', {
    cell: (info) => Number(info.getValue()),
  }),
  overallLeaderboardColumnHelper.accessor('name', {
    cell: (info) => info.getValue(),
  }),
];

/*
 *  Daily Leaderboard Table Columns
 */

export interface DailyLeaderboardEntry {
  createdAt: Date;
  user: { name: string };
}

const dailyLeaderboardColumnHelper = createColumnHelper<DailyLeaderboardEntry>();

export const dailyLeaderboardColumns = [
  dailyLeaderboardColumnHelper.display({
    id: 'ranking',
    header: '#',
    cell: (props) => props.row.index + 1,
  }),
  dailyLeaderboardColumnHelper.accessor('createdAt', {
    header: 'Time solved',
    cell: (info) => formatDate(info.getValue()),
  }),
  dailyLeaderboardColumnHelper.accessor('user.name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
];

/*
 *  Utilities - will move later
 */
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(date));
};

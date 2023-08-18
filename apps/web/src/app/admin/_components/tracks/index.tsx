'use client';

import { DataTable } from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import { ActionBar } from './action-bar';
import { columns } from './columns';
import { getTracks } from './tracks.actions';

export function ManageTracks() {
  const { data, isLoading } = useQuery(['admin-tracks'], () => getTracks());
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <ActionBar />
      <DataTable data={data} columns={columns} />
    </div>
  );
}

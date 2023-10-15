'use client';

import { DataTable } from '@repo/ui/components/data-table';
import { useQuery } from '@tanstack/react-query';
import { getPendingChallenges } from './challenge-reviews.action';
import { columns } from './columns';

export function ChallengeReviews() {
  const { data, isLoading } = useQuery(['challenge-reviews'], () => getPendingChallenges());

  return (
    <div className="w-full rounded-md border">
      {data ? <DataTable data={data} columns={columns} /> : ''}
    </div>
  );
}

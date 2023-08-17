'use client';

import { DataTable } from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import { getPendingChallenges } from './challenge-reviews.action';
import { columns } from './columns';

export function ChallengeReviews() {
  const { data, isLoading } = useQuery(['challenge-reviews'], () => getPendingChallenges());

  if (isLoading || !data) return null;

  return (
    <div className="w-full rounded-md border">
      <DataTable data={data} columns={columns} />
    </div>
  );
}

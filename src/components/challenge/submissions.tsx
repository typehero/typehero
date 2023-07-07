'use client';

import type { Solution } from '@prisma/client';
import { type Challenge } from '~/app/challenge/[id]/layout';
import { getRelativeTime } from '~/utils/relativeTime';
import clsx from 'clsx';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '~/components/ui/select';
import { useMemo, useState } from 'react';

interface Props {
  challenge: NonNullable<Challenge>;
}

type Status = 'all' | 'accepted' | 'rejected';
export function Submissions({ challenge }: Props) {
  const [selectedStatus, setSelectStatus] = useState<Status>('all');
  const submissions = challenge.solution;

  const filteredSubmissions = useMemo(() => {
    const predicate = (submission: Solution) => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'accepted') return submission.isSuccessful;
      return !submission.isSuccessful;
    };
    return submissions.filter(predicate);
  }, [selectedStatus, submissions]);
  return (
    <>
      <Select value={selectedStatus} onValueChange={(e) => setSelectStatus(e as Status)}>
        <div className="sticky right-0 top-[41px] flex justify-end border-b border-zinc-300 bg-background/90 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
          <SelectTrigger className="w-48 rounded-xl border border-zinc-300 bg-neutral-100 focus-visible:border-zinc-50 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-zinc-700 dark:bg-neutral-900">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
        </div>
        <SelectContent className="rounded-xl">
          <SelectGroup>
            <SelectItem className="cursor-pointer rounded-lg" value="all">
              All Statuses
            </SelectItem>
            <SelectItem className="cursor-pointer rounded-lg" value="accepted">
              Accepted
            </SelectItem>
            <SelectItem className="cursor-pointer rounded-lg" value="rejected">
              Rejected
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <ul className="relative flex flex-col">
        {filteredSubmissions.map((submission) => {
          return <SubmissionRow submission={submission} key={submission.id} />;
        })}
      </ul>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SubmissionRow({ submission }: { submission: Solution }) {
  const handleClick = () => {
    console.log('navigate to some route and overlay submission on top of editor');
  };
  return (
    <li
      className="flex cursor-pointer items-center justify-between px-4 py-2 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-zinc-700/50"
      onClick={handleClick}
    >
      <div
        className={clsx({
          'text-emerald-600  dark:text-emerald-400': submission.isSuccessful,
          'text-rose-600  dark:text-rose-400': !submission.isSuccessful,
        })}
      >
        {submission.isSuccessful ? 'Accepted' : 'Rejected'}
      </div>
      <div className="text-sm text-neutral-500">{getRelativeTime(submission.createdAt)}</div>
    </li>
  );
}

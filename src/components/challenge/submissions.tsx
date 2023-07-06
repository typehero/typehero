'use client';

import type { Solution } from '@prisma/client';
import type { Challenge } from '.';
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
  const [submissions] = useState(challenge.Solution);

  const filteredSubmissions = useMemo(() => {
    const predicate = (submission: Solution) => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'accepted') return submission.isSuccessful;
      return !submission.isSuccessful;
    };
    return submissions.filter(predicate);
  }, [selectedStatus, submissions]);
  return (
    <div>
      <div className="p-4">
        <Select value={selectedStatus} onValueChange={(e) => setSelectStatus(e as Status)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <ul className="relative flex flex-col">
          {filteredSubmissions.map((submission) => {
            return <SubmissionRow submission={submission} key={submission.id} />;
          })}
        </ul>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SubmissionRow({ submission }: { submission: Solution }) {
  const handleClick = () => {
    console.log('navigate to some route and overlay submission on top of editor');
  };
  return (
    <li
      className="p-4 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-neutral-700"
      onClick={handleClick}
    >
      <div
        className={clsx({
          ' text-emerald-600  dark:text-emerald-400': submission.isSuccessful,
          ' text-rose-600  dark:text-rose-400': !submission.isSuccessful,
        })}
      >
        {submission.isSuccessful ? 'Accepted' : 'Rejected'}
      </div>
      <div>{getRelativeTime(submission.createdAt)}</div>
    </li>
  );
}

'use client';

import type { Solution } from '@prisma/client';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { getRelativeTime } from '~/utils/relativeTime';
import clsx from 'clsx';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface Props {
  challenge: ChallengeRouteData;
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
      <div className="sticky right-0 top-[41px] flex gap-2 border-b border-zinc-300 bg-background/90 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
        <div
          className={`flex cursor-pointer gap-2 rounded-xl px-4 py-1 duration-300  ${
            selectedStatus === 'all'
              ? 'bg-blue-600 text-background dark:bg-blue-400'
              : 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/30 dark:bg-blue-400/10 dark:text-blue-400 dark:hover:bg-blue-400/30'
          }
            `}
          onClick={() => setSelectStatus('all')}
        >
          All
        </div>
        <div
          className={`flex cursor-pointer gap-2 rounded-xl px-4 py-1 duration-300  ${
            selectedStatus === 'accepted'
              ? 'bg-emerald-600 text-background dark:bg-emerald-400'
              : 'bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/30'
          }`}
          onClick={() => setSelectStatus('accepted')}
        >
          Accepted
        </div>
        <div
          className={`flex cursor-pointer gap-2 rounded-xl px-4 py-1 duration-300  ${
            selectedStatus === 'rejected'
              ? 'bg-rose-600 text-background dark:bg-rose-400'
              : 'bg-rose-600/10 text-rose-600 hover:bg-rose-600/30 dark:bg-rose-400/10 dark:text-rose-400 dark:hover:bg-rose-400/30'
          }`}
          onClick={() => setSelectStatus('rejected')}
        >
          Rejected
        </div>
      </div>

      <ul className="relative flex flex-col">
        {filteredSubmissions.map((submission) => {
          return (
            <SubmissionRow challengeId={challenge.id} submission={submission} key={submission.id} />
          );
        })}
      </ul>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SubmissionRow({ challengeId, submission }: { challengeId: number; submission: Solution }) {
  return (
    <li className="flex cursor-pointer items-center justify-between px-4 py-2 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-zinc-700/50">
      <Link className="w-full" href={`/challenge/${challengeId}/submissions/${submission.id}`}>
        <div
          className={clsx({
            'text-emerald-600  dark:text-emerald-400': submission.isSuccessful,
            'text-rose-600  dark:text-rose-400': !submission.isSuccessful,
          })}
        >
          {submission.isSuccessful ? 'Accepted' : 'Rejected'}
        </div>
        <div className="text-sm text-neutral-500">{getRelativeTime(submission.createdAt)}</div>
      </Link>
    </li>
  );
}

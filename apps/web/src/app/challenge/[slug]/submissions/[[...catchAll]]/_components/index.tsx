'use client';

import type { Submission } from '@repo/db/types';
import { Calendar } from '@repo/ui/icons';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import type { ChallengeSubmissions } from '../page';
import NoSubmissions from './nosubmissions';

interface Props {
  submissions: ChallengeSubmissions;
}

type Status = 'accepted' | 'all' | 'rejected';
export function Submissions({ submissions }: Props) {
  const [selectedStatus, setSelectStatus] = useState<Status>('all');

  const filteredSubmissions = useMemo(() => {
    const predicate = (submission: Submission) => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'accepted') return submission.isSuccessful;
      return !submission.isSuccessful;
    };
    return submissions.filter(predicate);
  }, [selectedStatus, submissions]);
  return (
    <div className="relative h-full">
      {submissions.length !== 0 ? (
        <div className="absolute top-0 right-0 flex w-full gap-2 border-zinc-300 border-b bg-background/70 p-2 px-4 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/70">
          <div
            className={`flex cursor-pointer gap-2 rounded-lg px-4 py-1 duration-300 ${
              selectedStatus === 'all'
                ? 'bg-blue-600 text-background dark:bg-blue-400'
                : 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/30 dark:bg-blue-400/10 dark:text-blue-400 dark:hover:bg-blue-400/30'
            }`}
            onClick={() => setSelectStatus('all')}
          >
            All
          </div>
          <div
            className={`flex cursor-pointer gap-2 rounded-lg px-4 py-1 duration-300 ${
              selectedStatus === 'accepted'
                ? 'bg-emerald-600 text-background dark:bg-emerald-400'
                : 'bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:hover:bg-emerald-400/30'
            }`}
            onClick={() => setSelectStatus('accepted')}
          >
            Accepted
          </div>
          <div
            className={`flex cursor-pointer gap-2 rounded-lg px-4 py-1 duration-300 ${
              selectedStatus === 'rejected'
                ? 'bg-rose-600 text-background dark:bg-rose-400'
                : 'bg-rose-600/10 text-rose-600 hover:bg-rose-600/30 dark:bg-rose-400/10 dark:text-rose-400 dark:hover:bg-rose-400/30'
            }`}
            onClick={() => setSelectStatus('rejected')}
          >
            Rejected
          </div>
        </div>
      ) : (
        <NoSubmissions />
      )}

      <ul className="custom-scrollable-element flex h-full flex-col overflow-y-auto pt-12">
        {filteredSubmissions.map((submission) => {
          return <SubmissionRow key={submission.id} submission={submission} />;
        })}
      </ul>
    </div>
  );
}

function SubmissionRow({ submission }: { submission: Submission }) {
  const { slug } = useParams();
  return (
    <li className="flex cursor-pointer items-center justify-between px-4 py-2 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-zinc-700/50">
      <Link className="w-full" href={`/challenge/${slug}/submissions/${submission.id}`}>
        <div
          className={clsx({
            'text-emerald-600 dark:text-emerald-400': submission.isSuccessful,
            'text-rose-600 dark:text-rose-400': !submission.isSuccessful,
          })}
        >
          {submission.isSuccessful ? 'Accepted' : 'Rejected'}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className=" h-4 w-4" />
          <span className="text-xs">{getRelativeTimeStrict(submission.createdAt)}</span>
        </div>
      </Link>
    </li>
  );
}

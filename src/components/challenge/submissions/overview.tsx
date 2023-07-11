import { X } from 'lucide-react';
import Link from 'next/link';

import type { ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { useMemo, useState } from 'react';
import { USER_CODE_START_REGEX } from '../editor/constants';

interface Props {
  challenge: ChallengeRouteData;
  submissionId: string;
}
export function SubmissionOverview({ challenge, submissionId }: Props) {
  const defaultCode = useMemo(() => {
    // if a user has an existing solution use that instead of prompt
    const submission = challenge.solution?.find((submission) => submission.id === +submissionId);

    const [appendSolutionToThis, separator] = challenge.prompt.split(USER_CODE_START_REGEX);
    const parsedUserSolution = submission?.code;

    return `${appendSolutionToThis ?? ''}${separator ?? ''}${parsedUserSolution}`;
  }, [challenge.prompt, challenge.solution, submissionId]);

  const [code, setCode] = useState(defaultCode);
  return (
    <>
      <div className="sticky top-0 flex h-[40px] items-center justify-between border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        <Link href={`/challenge/${challenge.id}/submissions`}>
          <X />
        </Link>
      </div>
      <div className="w-full flex-1 p-2">
        <pre>{JSON.stringify(code, null, 2)}</pre>
      </div>
      <div className="sticky bottom-0 flex items-center justify-end p-2 dark:bg-[#1e1e1e]"></div>
    </>
  );
}

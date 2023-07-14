'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import { CodePanel } from '~/components/challenge/editor';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { SubmissionOverview } from '~/components/challenge/submissions/overview';

export function Wrapper({ challenge }: { challenge: ChallengeRouteData }) {
  const segments = useSelectedLayoutSegments();

  if (!challenge) return null;

  if (segments[0] === 'submissions' && typeof segments[1] === 'string') {
    return <SubmissionOverview submissionId={segments[1]} />;
  }

  return <CodePanel mode="solve" challenge={challenge} />;
}

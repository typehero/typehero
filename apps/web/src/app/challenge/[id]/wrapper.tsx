'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import type { ChallengeRouteData } from './getChallengeRouteData';
import { CodePanel } from '../_components/code-panel';
import { SubmissionOverview } from './submissions/_components/overview';

export function Wrapper({ challenge }: { challenge: ChallengeRouteData }) {
  const segments = useSelectedLayoutSegments();

  if (!challenge) return null;

  if (segments[0] === 'submissions' && typeof segments[1] === 'string') {
    return <SubmissionOverview submissionId={segments[1]} />;
  }

  return <CodePanel challenge={challenge} />;
}

'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import { CodePanel } from '~/components/challenge/editor';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';

export function Wrapper({ challenge }: { challenge: ChallengeRouteData }) {
  const segments = useSelectedLayoutSegments();
  if (!challenge) return <div>loading</div>;
  console.log({ segments });
  // if on submissions/{id} feed the overlay as right panel
  // else use editor
  if (segments[0] === 'submissions' && typeof segments[1] === 'string') {
    return <div>FUCK YES BABY</div>;
  }
  return <CodePanel mode="solve" challenge={challenge} />;
}

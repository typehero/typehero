'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import { CodePanel } from '@repo/monaco';
import { useSession } from '@repo/auth/react';
import { SettingsButton } from '../_components/settings/settings-button';
import type { ChallengeRouteData } from './getChallengeRouteData';
import { SubmissionOverview } from './submissions/_components/overview';
import { saveSubmission } from './submissions/save-submission.action';

export function Wrapper({ challenge }: { challenge: ChallengeRouteData }) {
  const segments = useSelectedLayoutSegments();
  const { data: session } = useSession();

  if (!challenge) return null;

  if (segments[0] === 'submissions' && typeof segments[1] === 'string') {
    return <SubmissionOverview submissionId={segments[1]} />;
  }

  return (
    <CodePanel
      challenge={challenge}
      saveSubmission={(code, isSuccessful) =>
        saveSubmission(challenge.id, session?.user.id!, code, isSuccessful)
      }
      submissionDisabled={!session?.user}
      settingsElement={<SettingsButton />}
    />
  );
}

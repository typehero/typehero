'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import { CodePanel } from '@repo/monaco';
import { useSession } from '@repo/auth/react';
import type { ChallengeRouteData } from './getChallengeRouteData';
import { SubmissionOverview } from './submissions/[[...catchAll]]/_components/overview';
import { saveSubmission } from './submissions/[[...catchAll]]/save-submission.action';
import { FullscreenButton } from '../_components/fullscreen';
import { ResetEditorButton } from '../_components/reset-editor-button';
import { EditorShortcutsButton } from '../_components/editor-shortcuts/editor-shortcuts-button';
import { SettingsButton } from '../_components/settings/settings-button';

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
      settingsElement={<SettingsElements />}
    />
  );
}

function SettingsElements() {
  return (
    <>
      <ResetEditorButton />
      <EditorShortcutsButton />
      <SettingsButton />
      <FullscreenButton />
    </>
  );
}

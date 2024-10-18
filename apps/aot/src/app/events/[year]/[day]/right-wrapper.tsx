'use client';
import { useSession } from '@repo/auth/react';
import { CodePanel } from '@repo/monaco';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { SubmissionOverview } from './(submissions)/[[...catchAll]]/_components/overview';
import { saveSubmission } from './(submissions)/[[...catchAll]]/save-submission.action';
import { ResetEditorButton } from './_components/reset-editor-button';
import { EditorShortcutsButton } from './_components/editor-shortcuts/editor-shortcuts-button';
import { SettingsButton } from './_components/settings/settings-button';
import { FullscreenButton } from './fullscreen-button';

interface Props {
  challenge: any;
}

export function RightWrapper({ challenge }: Props) {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const { data: session } = useSession();

  if (!challenge) return null;

  if (segments[0] === 'submissions' && typeof segments[1] === 'string') {
    return <SubmissionOverview submissionId={segments[1]} />;
  }

  // Redirect to solution on successful submission and show suggestions
  async function handleSuccessfulSubmission(
    isSuccessful: boolean,
    submissionId: number,
    slug?: string,
  ) {
    const query = slug ? `&slug=${slug}` : '';
    isSuccessful &&
      router.push(`/challenge/${challenge.slug}/submissions/${submissionId}?success=true${query}`);
  }

  return (
    <CodePanel
      challenge={challenge}
      saveSubmission={async (code, isSuccessful) => {
        const submission = await saveSubmission({
          challenge,
          code,
          isSuccessful,
        });

        return handleSuccessfulSubmission(submission.isSuccessful, submission.id, '');
      }}
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

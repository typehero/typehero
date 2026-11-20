'use client';
import { useSession } from '@repo/auth/react';
import { CodePanel } from '@repo/monaco';
import { track as vercelTrack } from '@vercel/analytics';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { EditorShortcutsButton } from '../_components/editor-shortcuts/editor-shortcuts-button';
import { FullscreenButton } from '../../../components/fullscreen-button';
import { ResetEditorButton } from '../_components/reset-editor-button';
import { SettingsButton } from '../_components/settings/settings-button';
import type { ChallengeRouteData } from './getChallengeRouteData';
import { SubmissionOverview } from './submissions/[[...catchAll]]/_components/overview';
import SwapPanelButton from '../_components/swap-panel-button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '~/trpc/react';

interface RightWrapperProps {
  challenge: ChallengeRouteData['challenge'];
  track: ChallengeRouteData['track'];
  toggleDirection: () => void;
}

export function RightWrapper({ track, challenge, toggleDirection }: RightWrapperProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const { data: session } = useSession();
  const trpc = useTRPC();
  const { mutateAsync: createSubmission } = useMutation(trpc.submission.create.mutationOptions());

  if (!challenge) return null;

  if (segments[0] === 'submissions' && typeof segments[1] === 'string') {
    return <SubmissionOverview submissionId={segments[1]} userId={session?.user.id ?? ''} />;
  }

  // Redirect to solution on successful submission and show suggestions
  function handleSuccessfulSubmission(isSuccessful: boolean, submissionId: number, slug?: string) {
    const query = slug ? `&slug=${slug}` : '';
    if (isSuccessful) {
      router.push(`/challenge/${challenge.slug}/submissions/${submissionId}?success=true${query}`);
    }
  }

  return (
    <CodePanel
      challenge={challenge}
      saveSubmission={async (code, isSuccessful) => {
        vercelTrack?.('challenge-submitted', {
          success: !isSuccessful,
        });

        const submission = await createSubmission({
          challengeId: challenge.id,
          code,
          isSuccessful,
        });

        // Server actions refreshed the page's server-rendered data for us; a tRPC
        // mutation doesn't, so refresh so the submissions list reflects this attempt.
        router.refresh();

        if (submission.isSuccessful) {
          queryClient.invalidateQueries({
            queryKey: ['challenge-solutions', challenge.slug],
          });
        }

        return handleSuccessfulSubmission(submission.isSuccessful, submission.id, track?.slug);
      }}
      submissionDisabled={!session?.user}
      settingsElement={<SettingsElements toggleDirection={toggleDirection} />}
    />
  );
}

interface SettingsElementsProps {
  toggleDirection: () => void;
}

function SettingsElements({ toggleDirection }: SettingsElementsProps) {
  return (
    <>
      <ResetEditorButton />
      <EditorShortcutsButton />
      <SettingsButton />
      <SwapPanelButton toggleDirection={toggleDirection} />
      <FullscreenButton />
    </>
  );
}

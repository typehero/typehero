'use client';
import { useSession } from '@repo/auth/react';
import { CodePanel } from '@repo/monaco';
import { useParams, useRouter, useSelectedLayoutSegments } from 'next/navigation';
import type { Challenge } from './_components/types';
import { SubmissionOverview } from './submissions/[[...catchAll]]/_components/overview';
import { saveSubmission } from './submissions/[[...catchAll]]/save-submission.action';
import { SettingsElements } from './SettingsElements';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  challenge: Challenge;
}

export function RightWrapper({ challenge }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { year, day } = useParams();
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
    if (isSuccessful) {
      router.push(`/events/${year}/${day}/submissions/${submissionId}?success=true${query}`);
    }
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

        if (submission.isSuccessful) {
          queryClient.invalidateQueries({
            queryKey: ['challenge-solutions', challenge.slug],
          });
        }

        return handleSuccessfulSubmission(submission.isSuccessful, submission.id, '');
      }}
      submissionDisabled={!session?.user}
      settingsElement={<SettingsElements />}
    />
  );
}

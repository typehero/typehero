'use client';
import { SubmissionOverview } from '../../../@left/submissions/_components/overview';

export default function SubmissionPage({
  params: { slug, submissionId },
}: {
  params: { slug: string; submissionId: string };
}) {
  return <SubmissionOverview submissionId={submissionId} />;
}

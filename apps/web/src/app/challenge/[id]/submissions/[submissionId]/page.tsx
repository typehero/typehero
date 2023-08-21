import { notFound } from 'next/navigation';
import { getServerAuthSession } from '@repo/auth/server';
import { getChallengeSubmissions } from '../getChallengeSubmissions';
import { Submissions } from '../_components';

interface Props {
  params: {
    id: string;
    submissionId: string;
  };
}

export default async function SubmissionPage({ params: { id, submissionId } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await getChallengeSubmissions(session?.user.id ?? '', id);

  const isValidSubmission = submissions.some(
    (submission) => submission.id === Number(submissionId),
  );

  if (!isValidSubmission) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}

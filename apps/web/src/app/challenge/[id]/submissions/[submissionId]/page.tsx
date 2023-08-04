import { notFound } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';

import { Submissions } from '~/components/challenge/submissions';
import { getChallengeSubmissions } from '../getChallengeSubmissions';
interface Props {
  params: {
    id: string;
    submissionId: string;
  };
}

export default async function SubmissionPage({ params: { id, submissionId } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await getChallengeSubmissions(session?.user.id ?? '', id);

  const isValidSubmission = submissions?.some((submission) => submission.id === +submissionId);

  if (!isValidSubmission) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}

import { notFound } from 'next/navigation';
import { getChallengeSubmissions } from './getChallengeSubmissions';
import { Submissions } from '~/components/challenge/submissions';
import { getServerAuthSession } from '~/server/auth';

interface Props {
  params: {
    id: string;
  };
}

export default async function SubmissionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await getChallengeSubmissions(session?.user.id ?? '', id);

  if (!submissions) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}

import { notFound } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';

import { Submissions } from '~/components/challenge/submissions';
import { getChallengeSubmissions } from '../page';
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

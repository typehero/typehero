import { notFound } from 'next/navigation';
import { Submissions } from '~/components/challenge/submissions';
import { getServerAuthSession } from '~/server/auth';
import { getChallengeRouteData } from '../getChallengeRouteData';

interface Props {
  params: {
    id: string;
  };
}

export default async function SubmissionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  if (!challenge) {
    return notFound();
  }
  return <Submissions challenge={challenge} />;
}

import { notFound } from 'next/navigation';
import { getServerAuthSession } from '../../../../../server/auth';
import { getChallengeRouteData } from '../../getChallengeRouteData';
import { Submissions } from '~/components/challenge/submissions';
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

import { notFound } from 'next/navigation';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { getServerAuthSession } from '../../../../server/auth';
import { Solutions } from '~/components/challenge/solutions';

interface Props {
  params: {
    id: string;
  };
}

export default async function SolutionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  if (!challenge) {
    return notFound();
  }

  return <Solutions challenge={challenge} />;
}

import { notFound } from 'next/navigation';
import { Description } from '~/components/challenge/description';
import { getServerAuthSession } from '~/server/auth';
import { getChallengeRouteData } from './getChallengeRouteData';

interface Props {
  params: {
    id: string;
  };
}

export default async function Challenges({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  if (!challenge) {
    return notFound();
  }

  return <Description challenge={challenge} />;
}

import { notFound } from 'next/navigation';
import { LeftPanel } from '~/components/challenge/left-panel';
import { getChallengeRouteData } from './getChallengeRouteData';
import { getServerAuthSession } from '~/server/auth';

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

  console.log('challenge root');

  return <LeftPanel challenge={challenge} selectedTab={'description'} />;
}

import { notFound } from 'next/navigation';
import { getServerAuthSession } from '@repo/auth/server';
import { getChallengeRouteData } from './getChallengeRouteData';
import { Comments } from '~/components/challenge/comments';
import { Description } from '~/components/challenge/description';

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

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments rootId={challenge.id} type="CHALLENGE" />
    </div>
  );
}

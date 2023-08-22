import { notFound } from 'next/navigation';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Description } from '~/components/challenge/description';
import { getServerAuthSession } from '~/server/auth';
import { Comments } from '~/components/challenge/comments';

interface Props {
  params: {
    id: string;
  };
}

export default async function CommentPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  if (!challenge) {
    return notFound();
  }

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments type="CHALLENGE" expanded rootId={challenge.id} />
    </div>
  );
}

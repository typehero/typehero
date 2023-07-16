import { notFound } from 'next/navigation';
import { Description } from '~/components/challenge/description';
import { getServerAuthSession } from '~/server/auth';
import { getChallengeRouteData } from './getChallengeRouteData';
import Comments from '~/components/challenge/comments';

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
    <div className="relative flex h-full flex-col justify-between">
      <div className="px-4 py-3">
        <Description challenge={challenge}></Description>
      </div>

      <Comments challengeId={challenge.id} commentCount={challenge.comment.length} />
    </div>
  );
}

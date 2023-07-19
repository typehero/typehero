import { notFound } from 'next/navigation';
import { Description } from '~/components/challenge/description';
import { getServerAuthSession } from '~/server/auth';
import Comments from '~/components/challenge/comments';
import { getChallengeRouteData } from '../getChallengeRouteData';

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
      <Description challenge={challenge}></Description>
      <Comments expanded challengeId={challenge.id} commentCount={challenge.comment.length} />
    </div>
  );
}

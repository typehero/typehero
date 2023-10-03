import { getServerAuthSession } from '@repo/auth/server';
import { Description } from '../_components/description';
import { Comments } from '../_components/comments';
import { getChallengeRouteData } from './getChallengeRouteData';
import { buildMetaForChallenge } from '~/app/metadata';
import { getRelativeTime } from '~/utils/relativeTime';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params: { id } }: Props) {
  const challenge = await getChallengeRouteData(id, null);
  return buildMetaForChallenge({
    title: `${challenge.name} | TypeHero`,
    description: `${challenge.shortDescription} Can you solve it?`,
    username: challenge.user.name,
    difficulty: challenge.difficulty,
    date: getRelativeTime(challenge.createdAt),
  });
}

export default async function Challenges({ params: { id: challengeId } }: Props) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(challengeId, session);

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      <Comments rootId={challenge.id} type="CHALLENGE" />
    </div>
  );
}

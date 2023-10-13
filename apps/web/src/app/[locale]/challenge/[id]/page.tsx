import { getServerAuthSession, type Session } from '@repo/auth/server';
import { Description } from '../_components/description';
import { Comments } from '../_components/comments';
import { getChallengeRouteData } from './getChallengeRouteData';
import { buildMetaForChallenge } from '~/app/metadata';
import { getRelativeTime } from '~/utils/relativeTime';
import { getAllFlags } from '~/utils/feature-flags';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params: { id } }: Props) {
  const challenge = await getChallengeRouteData(id, null);
  const description = `Unlock your TypeScript potential by solving the ${challenge.name} challenge on TypeHero.`;

  return buildMetaForChallenge({
    title: `${challenge.name} | TypeHero`,
    description,
    username: challenge.user.name,
    difficulty: challenge.difficulty,
    date: getRelativeTime(challenge.createdAt),
  });
}

export default async function Challenges({ params: { id: challengeId } }: Props) {
  // early acces you must be authorized
  const session = await getServerAuthSession();
  const flags = await getAllFlags();

  if (!session && flags.enableEarlyAccess) {
    return redirect('/waitlist');
  }

  const challenge = await getChallengeRouteData(challengeId, session);

  return (
    <div className="relative h-full ">
      <Description challenge={challenge} />
      <Comments rootId={challenge.id} type="CHALLENGE" />
    </div>
  );
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return userId && session?.user?.id && userId === session?.user?.id;
}

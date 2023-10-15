import { getServerAuthSession, type Session } from '@repo/auth/server';
import { redirect } from 'next/navigation';
import { buildMetaForChallenge } from '~/app/metadata';
import { getRelativeTime } from '~/utils/relativeTime';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { Comments } from '../_components/comments';
import { Description } from '../_components/description';
import { getChallengeRouteData } from './getChallengeRouteData';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: Props) {
  const challenge = await getChallengeRouteData(slug, null);
  const description = `Unlock your TypeScript potential by solving the ${challenge.name} challenge on TypeHero.`;

  return buildMetaForChallenge({
    title: `${challenge.name} | TypeHero`,
    description,
    username: challenge.user.name,
    difficulty: challenge.difficulty,
    date: getRelativeTime(challenge.createdAt),
  });
}

export default async function Challenges({ params: { slug } }: Props) {
  // early acces you must be authorized
  const session = await getServerAuthSession();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  const challenge = await getChallengeRouteData(slug, session);

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

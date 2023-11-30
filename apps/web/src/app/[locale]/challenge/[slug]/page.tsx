import { auth, type Session } from '@repo/auth/server';
import { notFound, redirect } from 'next/navigation';
import { buildMetaForChallenge } from '~/app/metadata';
import { getRelativeTime } from '~/utils/relativeTime';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { Comments } from '../_components/comments';
import { Description } from '../_components/description';
import { getChallengeRouteData } from './getChallengeRouteData';
import { getAllFlags } from '~/utils/feature-flags';
import { AOT_CHALLENGES } from './aot-slugs';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: Props) {
  const { challenge } = await getChallengeRouteData(slug, null);
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
  // early access you must be authorized
  const session = await auth();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  const { enableHolidayEvent } = await getAllFlags();
  const isAotChallenge = AOT_CHALLENGES.includes(slug);

  if (enableHolidayEvent && isAotChallenge) {
    const [, day = '1'] = slug.split('-');
    const daysPassed = daysAfterDecemberFirst();

    if (parseInt(day) > daysPassed - 1) {
      return notFound();
    }
  }

  const { challenge } = await getChallengeRouteData(slug, session);

  return (
    <div className="relative h-full ">
      <Description challenge={challenge} />
      {!isAotChallenge ? <Comments rootId={challenge.id} type="CHALLENGE" /> : null}
    </div>
  );
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return userId && session?.user?.id && userId === session?.user?.id;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
function daysAfterDecemberFirst() {
  const startDate: Date = new Date('2023-12-01');
  const today: Date = new Date();

  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;

  return daysPassed;
}

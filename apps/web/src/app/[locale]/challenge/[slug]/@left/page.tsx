import { auth, type Session } from '@repo/auth/server';
import { notFound, redirect } from 'next/navigation';
import { buildMetaForChallenge, buildMetaForEventPage } from '~/app/metadata';
import { daysAfterDecemberFirst } from '~/utils/aot';
import { getAllFlags } from '~/utils/feature-flags';
import { getRelativeTime } from '~/utils/relativeTime';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { Comments } from '../../_components/comments';
import { Description } from '../../_components/description';
import { AOT_CHALLENGES } from '../aot-slugs';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { Markdown } from '@repo/ui/components/markdown';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params: { slug } }: Props) {
  if (AOT_CHALLENGES.includes(slug)) {
    return buildMetaForEventPage({
      title: 'Advent of Typescript 2023 | TypeHero',
      description: 'Advent of Typescript 2023',
    });
  }

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

    if (parseInt(day) > daysPassed + 1) {
      return notFound();
    }
  }

  const { challenge } = await getChallengeRouteData(slug, session);

  return (
    <div className="relative h-full ">
      <Description challenge={challenge}>
        <div className="prose-invert prose-h3:text-xl mt-6 leading-7">
          <Markdown>{challenge.description}</Markdown>
        </div>
      </Description>
      {!isAotChallenge ? <Comments rootId={challenge.id} type="CHALLENGE" /> : null}
    </div>
  );
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return userId && session?.user?.id && userId === session?.user?.id;
}

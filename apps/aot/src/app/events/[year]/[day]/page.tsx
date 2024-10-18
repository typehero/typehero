import { type Session } from '@repo/auth/server';
import { auth } from '~/server/auth';
import { api } from '~/trpc/server';
import { Comments } from './_components/comments';
import { Description } from './_components/description';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

// export async function generateMetadata({ params: { slug } }: Props) {
//   if (AOT_CHALLENGES.includes(slug)) {
//     return buildMetaForEventPage({
//       title: 'Advent of Typescript 2023 | TypeHero',
//       description: 'Advent of Typescript 2023',
//     });
//   }
//
//   const { challenge } = await getChallengeRouteData(slug, null);
//   const description = `Unlock your TypeScript potential by solving the ${challenge.name} challenge on TypeHero.`;
//
//   return buildMetaForChallenge({
//     title: `${challenge.name} | TypeHero`,
//     description,
//     username: challenge.user.name,
//     difficulty: challenge.difficulty,
//     date: getRelativeTimeStrict(challenge.createdAt),
//   });
// }

export default async function Challenges({ params: { year, day } }: Props) {
  const session = await auth();

  // const { challenge } = await getChallengeRouteData(slug, session);

  const challenge = await api.event.getEventChallengeBySlug({ slug: `${year}-${day}` });

  return (
    <div className="relative h-full ">
      <Description challenge={challenge} />
      <Comments root={challenge} type="CHALLENGE" />
    </div>
  );
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return userId && session?.user?.id && userId === session?.user?.id;
}

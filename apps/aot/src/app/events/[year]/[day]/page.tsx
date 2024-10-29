import { type Session } from '@repo/auth/server';
import { api } from '~/trpc/server';
import { Comments } from './_components/comments';
import { Description } from './_components/description';
import { buildMetaForEventPage } from '~/utils/metadata';
import { notFound } from 'next/navigation';
import { daysAfterDecemberFirst } from '~/utils/aot';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export async function generateMetadata({ params: { year } }: Props) {
  return buildMetaForEventPage({
    title: `Advent of Typescript ${year}`,
    description: `Advent of Typescript ${year}`,
  });
}

export default async function Challenges({ params: { year, day } }: Props) {
  const daysPassed = daysAfterDecemberFirst(year);

  if (parseInt(day) > daysPassed) {
    return notFound();
  }
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

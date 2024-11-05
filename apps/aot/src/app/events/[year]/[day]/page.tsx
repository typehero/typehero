import { type Session } from '@repo/auth/server';
import { api } from '~/trpc/server';
import { Comments } from './_components/comments';
import { Description } from './_components/description';
import { notFound } from 'next/navigation';
import { daysAfterDecemberFirst, isAfterJanuaryFirst } from '~/utils/aot';
import { getAllFlags } from '~/utils/feature-flag';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export default async function Challenges({ params: { year, day } }: Props) {
  const { unlockAotChallenges } = await getAllFlags();
  const daysPassed = daysAfterDecemberFirst(year);

  if (!unlockAotChallenges && parseInt(day) > daysPassed) {
    return notFound();
  }
  const challenge = await api.event.getEventChallengeBySlug({ slug: `${year}-${day}` });

  return (
    <div className="relative h-full">
      <Description challenge={challenge} />
      {isAfterJanuaryFirst(Number(year)) && <Comments root={challenge} type="CHALLENGE" />}
    </div>
  );
}

export function isAuthor(session: Session | null, userId?: string | null) {
  return userId && session?.user?.id && userId === session?.user?.id;
}

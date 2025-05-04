import { type Session } from '@repo/auth/server';
import { api } from '~/trpc/server';
import { getAotSlug } from '~/utils/getAotSlug';
import { isAfterJanuaryFirst, isChallengeUnlocked } from '~/utils/time-utils';
import { Comments } from './_components/comments';
import { Description } from './_components/description';
import { getAllFlags } from '~/utils/feature-flag';
import { notFound } from 'next/navigation';

interface ChallengesProps {
  params: Promise<{
    year: string;
    day: string;
  }>;
}

export default async function Challenges(props: ChallengesProps) {
  const params = await props.params;

  const {
    year,
    day
  } = params;

  const { unlockAotChallenges } = await getAllFlags();
  if (!isChallengeUnlocked(Number(year), Number(day)) && !unlockAotChallenges) {
    return notFound();
  }
  const challenge = await api.event.getEventChallengeBySlug({ slug: getAotSlug({ year, day }) });

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

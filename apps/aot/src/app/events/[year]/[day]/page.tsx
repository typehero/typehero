import { type Session } from '@repo/auth/server';
import { api } from '~/trpc/server';
import { getAotSlug } from '~/utils/getAotSlug';
import { isAfterJanuaryFirst } from '~/utils/time-utils';
import { Comments } from './_components/comments';
import { Description } from './_components/description';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export default async function Challenges({ params: { year, day } }: Props) {
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

import { isChallengeUnlocked } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { YEAR } from '../../date_constants';

export default async function DailyLeaderboardLayout(
  props: {
    params: Promise<{ day: string }>;
    children: React.ReactNode;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const day = Number(params.day);
  const year = Number(YEAR);

  if (!isChallengeUnlocked(year, day)) return notFound();

  return children;
}

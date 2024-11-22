import { isChallengeUnlocked } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import { YEAR } from '../../date_constants';

export default function DailyLeaderboardLayout({
  params,
  children,
}: {
  params: { day: string };
  children: React.ReactNode;
}) {
  const day = Number(params.day);
  const year = Number(YEAR);

  if (!isChallengeUnlocked(year, day)) return notFound();

  return children;
}

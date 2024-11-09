import { isChallengeUnlocked } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import AdventDaysRow from '../_components/advent-days-row';

export default function DailyLeaderboardLayout({
  params,
  children,
}: {
  params: { day: string; year: string };
  children: React.ReactNode;
}) {
  const day = Number(params.day);
  const year = Number(params.year);

  if (!isChallengeUnlocked(year, day)) return notFound();

  return (
    <>
      <p>DAILY LEADERBOARD!</p>
      <AdventDaysRow year={year} selectedDay={day} />
      {children}
    </>
  );
}

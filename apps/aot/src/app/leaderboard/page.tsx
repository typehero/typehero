import { getCurrentAdventDay } from '~/utils/time-utils';
import OverallLeaderboard from './_components/overall-leaderboard';
import AdventDaysRow from './_components/advent-days-row';
import { notFound } from 'next/navigation';

export default function LeaderboardPage() {
  const currentAdventDay = getCurrentAdventDay();
  if (currentAdventDay <= 0) return notFound();

  return (
    <>
      <AdventDaysRow currentAdventDay={currentAdventDay} />
      <OverallLeaderboard currentAdventDay={currentAdventDay} />
    </>
  );
}

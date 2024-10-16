import { getCurrentAdventDay } from '~/utils/time-utils';
import OverallLeaderboard from './_components/overall-leaderboard';
import AdventDaysRow from './_components/advent-days-row';

export default function LeaderboardPage() {
  const currentAdventDay = getCurrentAdventDay();
  return (
    <>
      <AdventDaysRow currentAdventDay={currentAdventDay} />
      <OverallLeaderboard />
    </>
  );
}

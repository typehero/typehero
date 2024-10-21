import { getCurrentAdventDay } from '~/utils/time-utils';
import AdventDaysRow from '../../_components/advent-days-row';

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  const currentAdventDay = getCurrentAdventDay();

  return (
    <>
      <AdventDaysRow currentAdventDay={currentAdventDay} selectedDay={1} />
      {children}
    </>
  );
}

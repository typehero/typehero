import { notFound } from 'next/navigation';
import { validateAdventDay } from '~/utils/time-utils';
import AdventDaysRow from '../../_components/advent-days-row';

export default function LeaderboardLayout({
  children,
  params: { day: routeDay },
}: {
  children: React.ReactNode;
  params: { day: number };
}) {
  const routeDayNum = Number(routeDay);
  const currentAdventDay = validateAdventDay(routeDayNum);
  if (!currentAdventDay) return notFound();

  return (
    <>
      <AdventDaysRow currentAdventDay={currentAdventDay} selectedDay={routeDayNum} />
      {children}
    </>
  );
}

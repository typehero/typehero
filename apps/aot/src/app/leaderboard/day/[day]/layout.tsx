import { isValidAdventDay } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import AdventDaysRow from '../../_components/advent-days-row';

export default function DailyLeaderboardLayout({
  params: { day },
  children,
}: {
  params: { day: string };
  children: React.ReactNode;
}) {
  const routeDayNum = Number(day);
  if (!isValidAdventDay(routeDayNum)) return notFound();

  return (
    <>
      <AdventDaysRow selectedDay={routeDayNum} />
      {children}
    </>
  );
}

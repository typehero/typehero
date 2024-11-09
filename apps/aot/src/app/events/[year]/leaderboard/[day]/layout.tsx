import { isValidAdventDay } from '~/utils/time-utils';
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

  if (!isValidAdventDay(day)) return notFound();

  return (
    <>
      <AdventDaysRow year={year} selectedDay={day} />
      {children}
    </>
  );
}

import { isValidAdventDay } from '~/utils/time-utils';
import { notFound } from 'next/navigation';
import AdventDaysRow from '../../../[year]/leaderboard/_components/advent-days-row';
import { YEAR, DAY } from '../../date_constants';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from({ length: DAY }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default function DailyLeaderboardLayout({
  params,
  children,
}: {
  params: { day: string };
  children: React.ReactNode;
}) {
  const day = Number(params.day);

  if (!isValidAdventDay(day)) return notFound();

  return (
    <>
      {/* <AdventDaysRow year={YEAR} selectedDay={day} /> */}
      {children}
    </>
  );
}

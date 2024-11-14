import { isValidAdventDay } from '~/utils/time-utils';
import { notFound } from 'next/navigation';

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

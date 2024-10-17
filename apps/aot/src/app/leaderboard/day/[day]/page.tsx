import { getCurrentAdventDay, validateAdventDay } from '~/utils/time-utils';
import DailyLeaderboard from './_components/daily-leaderboard';
import { notFound } from 'next/navigation';

// export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const currentAdventDay = getCurrentAdventDay();
  return Array.from({ length: currentAdventDay }, (_, i) => ({ day: (i + 1).toString() }));
}

export default async function Page({ params: { day } }: { params: { day: string } }) {
  const routeDayNum = Number(day);
  const currentAdventDay = validateAdventDay(routeDayNum);
  if (!currentAdventDay) return notFound();

  return <DailyLeaderboard adventDay={routeDayNum} />;
}

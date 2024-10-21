import { validateAdventDay } from '~/utils/time-utils';
import DailyLeaderboard from '../../_components/daily-leaderboard';
import { notFound } from 'next/navigation';

// export const revalidate = 10; Need next.js v15

export default async function Page({ params: { day } }: { params: { day: string } }) {
  const routeDayNum = Number(day);
  const currentAdventDay = validateAdventDay(routeDayNum);
  if (!currentAdventDay) return notFound();

  return <DailyLeaderboard adventDay={routeDayNum} />;
}

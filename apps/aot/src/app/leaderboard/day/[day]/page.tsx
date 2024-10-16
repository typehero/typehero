import { validateAdventDay } from '~/utils/time-utils';
import DailyLeaderboard from './_components/daily-leaderboard';
import { notFound } from 'next/navigation';

// `app/page.tsx` is the UI for the `/` URL
export default async function Page({ params: { day } }: { params: { day: number } }) {
  const routeDayNum = Number(day);
  const currentAdventDay = validateAdventDay(routeDayNum);
  if (!currentAdventDay) return notFound();

  return <DailyLeaderboard adventDay={routeDayNum} />;
}

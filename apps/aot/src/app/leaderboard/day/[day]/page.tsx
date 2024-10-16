import { validateAdventDay, type AdventDay } from '~/utils/time-utils';
import DailyLeaderboard from './_components/daily-leaderboard';
import { notFound } from 'next/navigation';

// `app/page.tsx` is the UI for the `/` URL
export default async function Page({ params: { day } }: { params: { day: AdventDay } }) {
  if (!validateAdventDay(day)) return notFound();
  return <DailyLeaderboard adventDay={day} />;
}

import DailyLeaderboard from '../../../[year]/leaderboard/_components/daily-leaderboard';
import { YEAR, DAY } from '../../date_constants';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from({ length: DAY }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default function Page({ params: { day } }: { params: { day: string } }) {
  return <DailyLeaderboard adventYear={YEAR.toString()} adventDay={day} />;
}

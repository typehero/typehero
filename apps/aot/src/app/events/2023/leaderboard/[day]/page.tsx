import DailyLeaderboard from '../../../[year]/leaderboard/_components/daily-leaderboard';
import { YEAR } from '../../year';

export async function generateStaticParams() {
  return Array.from({ length: 25 }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default function Page({ params: { day } }: { params: { day: string } }) {
  return (
    <>
      statically generted
      <DailyLeaderboard adventYear={YEAR.toString()} adventDay={day} />
    </>
  );
}

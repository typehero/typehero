import DailyLeaderboard from '../_components/daily-leaderboard';

// export const revalidate = 10; Need next.js v15

export default function Page({ params: { year, day } }: { params: { year: string; day: string } }) {
  return <DailyLeaderboard adventYear={year} adventDay={day} />;
}

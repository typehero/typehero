import DailyLeaderboard from '../../_components/daily-leaderboard';

// export const revalidate = 10; Need next.js v15

export default async function Page({ params: { day } }: { params: { day: string } }) {
  const routeDayNum = Number(day);

  return <DailyLeaderboard adventDay={routeDayNum} />;
}

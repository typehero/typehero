import { getFirst100SubmissionsRanked } from '../../../_components/daily-leaderboard';
import { LeaderboardPage } from '../../../_components/leaderboard-page';
import { DAY, YEAR } from '../../date_constants';

export function generateStaticParams() {
  return Array.from({ length: DAY }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default async function Page({ params: { day } }: { params: { day: string } }) {
  const data = await getFirst100SubmissionsRanked(YEAR.toString(), day);
  return <LeaderboardPage data={data} isDayPage />;
}

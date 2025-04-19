import { getFirst100SubmissionsRanked } from '../../../_components/daily-leaderboard';
import { LeaderboardPage } from '../../../_components/leaderboard-page';
import { YEAR } from '../../date_constants';

export default async function Page({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;

  const data = await getFirst100SubmissionsRanked(YEAR.toString(), day);
  return <LeaderboardPage data={data} isDayPage />;
}

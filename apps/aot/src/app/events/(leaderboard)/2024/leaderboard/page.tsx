import { getAllFlags } from '~/utils/feature-flag';
import { notFound } from 'next/navigation';
import { buildMetaForEventPage } from '~/utils/metadata';
import { LeaderboardPage } from '../../_components/leaderboard-page';
import { getOverallLeaderboard, getOverallTableData } from '../../_components/overall-leaderboard';
import { YEAR } from '../date_constants';

export function generateMetadata() {
  return buildMetaForEventPage();
}
export default async function Page() {
  const { enableAotPlatform } = await getAllFlags();
  if (!enableAotPlatform) {
    return notFound();
  }

  const leaderboardEntries = await getOverallLeaderboard(YEAR, true);
  const data = await getOverallTableData(leaderboardEntries);
  return <LeaderboardPage data={data} isDayPage={false} />;
}

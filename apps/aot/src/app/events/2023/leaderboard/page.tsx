import { getAllFlags } from '~/utils/feature-flag';
import AdventDaysRow from '../../[year]/leaderboard/_components/advent-days-row';
import OverallLeaderboard from '../../[year]/leaderboard/_components/overall-leaderboard';
import { notFound } from 'next/navigation';
import { buildMetaForEventPage } from '~/utils/metadata';
import { YEAR } from '../date_constants';

export const dynamic = 'force-static';

export async function generateMetadata() {
  return buildMetaForEventPage({
    title: 'Advent of Typescript',
    description: 'Advent of Typescript',
  });
}
export default async function LeaderboardPage() {
  const { enableAotPlatform } = await getAllFlags();
  if (!enableAotPlatform) {
    return notFound();
  }

  return (
    <>
      <p>OVERALL LEADERBOARD!</p>
      <AdventDaysRow year={YEAR} />
      <OverallLeaderboard isPast year={YEAR} />
    </>
  );
}

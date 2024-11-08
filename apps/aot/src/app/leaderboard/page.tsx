import { getAllFlags } from '~/utils/feature-flag';
import AdventDaysRow from './_components/advent-days-row';
import OverallLeaderboard from './_components/overall-leaderboard';
import { notFound } from 'next/navigation';
import { buildMetaForEventPage } from '~/utils/metadata';

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
      <AdventDaysRow />
      <OverallLeaderboard />
    </>
  );
}

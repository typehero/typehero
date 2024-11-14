import { getAllFlags } from '~/utils/feature-flag';
import { notFound } from 'next/navigation';
import { buildMetaForEventPage } from '~/utils/metadata';
import { LeaderboardTable } from './_components/table';
import { Stage } from './_components/stage';
import { getOverallLeaderboard } from '../../[year]/leaderboard/_components/overall-leaderboard';

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

  const top100 = await getOverallLeaderboard(2023);

  return (
    <div className="">
      <div className="fixed inset-0 left-[5%] top-32 h-[300px] max-w-sm border lg:left-0 lg:top-32 lg:h-[500px] lg:max-w-full">
        <Stage data={top100.slice(0, 3)} />
      </div>
      <div className="bg-background relative mt-[330px] rounded-lg p-6 shadow-[0px_-70px_150px_-53px_hsla(221,83%,53%,1)] lg:mt-[490px]">
        <LeaderboardTable data={top100} isDayTable={false} />
      </div>
    </div>
  );
}

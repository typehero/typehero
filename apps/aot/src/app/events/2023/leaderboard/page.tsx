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

  const data = await getOverallLeaderboard(2023, true);

  return (
    <div>
      <div className="fixed inset-0 left-[5%] top-32 h-[300px] max-w-sm border md:left-0 md:max-w-full lg:top-32 lg:h-[500px]">
        <Stage data={data.slice(0, 3)} isDayStage={false} />
      </div>
      <div className="border-[hsla(0, 0%, 100%, 0.12)] mx-auto mt-[330px] max-w-screen-lg rounded-2xl border bg-[hsla(0,0%,100%,0.07)] p-2 shadow-[0px_-18px_131px_-78px_hsla(221,83%,53%,1)] backdrop-blur-sm lg:mt-[490px]">
        <div className="bg-background relative rounded-lg">
          <LeaderboardTable data={data} isDayTable={false} />
        </div>
      </div>
    </div>
  );
}

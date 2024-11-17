import { getAllFlags } from '~/utils/feature-flag';
import { notFound } from 'next/navigation';
import { buildMetaForEventPage } from '~/utils/metadata';
import { LeaderboardTable } from './_components/table';
import { Stage } from './_components/stage';
import {
  getOverallLeaderboard,
  getOverallTableData,
} from '../../[year]/leaderboard/_components/overall-leaderboard';

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

  const leaderboardEntries = await getOverallLeaderboard(2023, true);
  const data = await getOverallTableData(leaderboardEntries);

  return (
    <div>
      <div className="container fixed inset-0 top-32 ">
        <div className="top-32 mx-auto h-[220px] border px-4 md:left-0 md:h-[330px] md:max-w-full lg:h-[500px]">
          <Stage data={data.slice(0, 3)} isDayStage={false} />
        </div>
      </div>
      <div className="border-[hsla(0, 0%, 100%, 0.12)] mx-auto mt-[255px] max-w-screen-lg rounded-2xl border bg-[hsla(0,0%,100%,0.07)] p-2 shadow-[0px_-18px_131px_-78px_hsla(221,83%,53%,1)] backdrop-blur-sm md:mt-[350px] lg:mt-[500px]">
        <div className="bg-background relative rounded-lg">
          <LeaderboardTable data={data} isDayTable={false} />
        </div>
      </div>
    </div>
  );
}

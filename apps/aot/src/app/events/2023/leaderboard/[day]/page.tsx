import { getFirst100SubmissionsRanked } from '../../../[year]/leaderboard/_components/daily-leaderboard';
import { DAY } from '../../date_constants';
import { Stage } from '../_components/stage';
import { LeaderboardTable } from '../_components/table';

export async function generateStaticParams() {
  return Array.from({ length: DAY }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default async function Page({ params: { day } }: { params: { day: string } }) {
  const data = await getFirst100SubmissionsRanked('2023', day);
  return (
    <div className="">
      <div className="fixed inset-0 left-[5%] top-32 h-[300px] max-w-sm border lg:left-[15%] lg:top-32 lg:h-[500px] lg:max-w-screen-lg">
        <Stage data={data.slice(0, 3)} />
      </div>
      <div className="bg-background relative mt-[330px] rounded-lg p-6 shadow-[0px_-70px_150px_-53px_hsla(221,83%,53%,1)] lg:mt-[490px]">
        <LeaderboardTable data={data} isDayTable />
      </div>
    </div>
  );
}

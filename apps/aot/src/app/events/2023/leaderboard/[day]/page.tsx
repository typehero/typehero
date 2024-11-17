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
    <div>
      <div className="container fixed inset-0 top-32 ">
        <div className="top-32 mx-auto h-[220px] border px-4 md:left-0 md:h-[330px] md:max-w-full lg:h-[400px] xl:h-[500px]">
          <Stage data={data.slice(0, 3)} isDayStage />
        </div>
      </div>
      <div className="border-[hsla(0, 0%, 100%, 0.12)] mx-auto mt-[255px] max-w-screen-lg rounded-2xl border bg-[hsla(0,0%,100%,0.07)] p-2 shadow-[0px_-18px_131px_-78px_hsla(221,83%,53%,1)] backdrop-blur-sm md:mt-[350px] lg:mt-[500px]">
        <div className="bg-background relative rounded-lg">
          <LeaderboardTable data={data} isDayTable />
        </div>
      </div>
    </div>
  );
}

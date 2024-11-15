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
      <div className="fixed inset-0 left-[5%] top-32 h-[300px] max-w-sm border md:left-0 md:max-w-full lg:top-32 lg:h-[500px]">
        <Stage data={data.slice(0, 3)} />
      </div>
      <div className="border-[hsla(0, 0%, 100%, 0.12)] mt-[330px] rounded-2xl border bg-[hsla(0,0%,100%,0.07)] p-2 shadow-[0px_-18px_131px_-78px_hsla(221,83%,53%,1)] backdrop-blur-sm lg:mt-[490px] ">
        <div className="bg-background relative rounded-lg ">
          <LeaderboardTable data={data} isDayTable />
        </div>
      </div>
    </div>
  );
}

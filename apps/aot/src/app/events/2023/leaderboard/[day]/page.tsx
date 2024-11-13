import DailyLeaderboard, {
  getFirst100SubmissionsRanked,
} from '../../../[year]/leaderboard/_components/daily-leaderboard';
import { YEAR, DAY } from '../../date_constants';
import { Stage } from '../_components/stage';
import { LeaderboardTable } from '../_components/table';

export async function generateStaticParams() {
  return Array.from({ length: DAY }).map((_, index) => ({ day: (index + 1).toString() }));
}

export default async function Page({ params: { day } }: { params: { day: string } }) {
  const data = await getFirst100SubmissionsRanked('2023', day);
  return (
    <div className="container pt-8">
      {/* <div className="fixed inset-0 h-[500px] w-[400px] bg-red-500"></div> */}
      <div className="fixed inset-0 top-16 h-[300px] lg:top-32 lg:h-[500px]">
        <Stage data={data.slice(0, 3)} />
      </div>
      <div
        className="bg-background relative mt-[230px] rounded-lg p-6 shadow-[0px_-70px_150px_-53px_hsla(221,83%,53%,1)] lg:mt-[490px]
"
      >
        <LeaderboardTable data={data} isDayTable />
      </div>
    </div>
  );
  // return <DailyLeaderboard adventYear={YEAR.toString()} adventDay={day} />;
}

import { getAllFlags } from '~/utils/feature-flag';
import { notFound } from 'next/navigation';
import { buildMetaForEventPage } from '~/utils/metadata';
import { LeaderboardTable } from './_components/table';
import { DayScroller } from './_components/day-scroller';
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

  // const top100 = await getOverallLeaderboard(2023);

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
        <LeaderboardTable data={data} isDayTable={false} />
      </div>
    </div>
  );
}
/* <>
      <AdventDaysRow year={YEAR} />
      <OverallLeaderboard year={YEAR} />
    </> */

const data = [
  { name: 'User 126', image: null, totalPoints: '1141', isSupporter: true },
  { name: 'User 143', image: null, totalPoints: '1043', isSupporter: false },
  { name: 'User 0', image: null, totalPoints: '1039', isSupporter: false },
  { name: 'User 1', image: null, totalPoints: '1031', isSupporter: true },
  { name: 'User 197', image: null, totalPoints: '1029', isSupporter: false },
  { name: 'User 10', image: null, totalPoints: '994', isSupporter: false },
  { name: 'User 6', image: null, totalPoints: '988', isSupporter: true },
  { name: 'User 7', image: null, totalPoints: '971', isSupporter: false },
  { name: 'User 57', image: null, totalPoints: '956', isSupporter: false },
  { name: 'User 72', image: null, totalPoints: '948', isSupporter: false },
  { name: 'User 122', image: null, totalPoints: '910', isSupporter: true },
  { name: 'User 108', image: null, totalPoints: '900', isSupporter: false },
  { name: 'User 39', image: null, totalPoints: '879', isSupporter: false },
  { name: 'User 34', image: null, totalPoints: '874', isSupporter: false },
  { name: 'User 5', image: null, totalPoints: '858', isSupporter: false },
  { name: 'User 145', image: null, totalPoints: '855', isSupporter: false },
  { name: 'User 150', image: null, totalPoints: '854', isSupporter: true },
  { name: 'User 155', image: null, totalPoints: '852', isSupporter: false },
  { name: 'User 21', image: null, totalPoints: '848', isSupporter: false },
  { name: 'User 157', image: null, totalPoints: '847', isSupporter: false },
  { name: 'User 165', image: null, totalPoints: '835', isSupporter: false },
  { name: 'User 186', image: null, totalPoints: '827', isSupporter: false },
  { name: 'User 121', image: null, totalPoints: '810', isSupporter: false },
  { name: 'User 141', image: null, totalPoints: '806', isSupporter: false },
  { name: 'User 30', image: null, totalPoints: '800', isSupporter: true },
  { name: 'User 3', image: null, totalPoints: '800', isSupporter: false },
  { name: 'User 174', image: null, totalPoints: '798', isSupporter: false },
  { name: 'User 103', image: null, totalPoints: '792', isSupporter: false },
  { name: 'User 161', image: null, totalPoints: '790', isSupporter: false },
  { name: 'User 156', image: null, totalPoints: '788', isSupporter: false },
  { name: 'User 75', image: null, totalPoints: '785', isSupporter: false },
  { name: 'User 83', image: null, totalPoints: '785', isSupporter: false },
  { name: 'User 134', image: null, totalPoints: '782', isSupporter: false },
  { name: 'User 62', image: null, totalPoints: '779', isSupporter: true },
  { name: 'User 29', image: null, totalPoints: '774', isSupporter: false },
  { name: 'User 97', image: null, totalPoints: '768', isSupporter: false },
  { name: 'User 177', image: null, totalPoints: '761', isSupporter: false },
  { name: 'User 140', image: null, totalPoints: '759', isSupporter: false },
  { name: 'User 85', image: null, totalPoints: '757', isSupporter: false },
  { name: 'User 35', image: null, totalPoints: '749', isSupporter: false },
  { name: 'User 119', image: null, totalPoints: '748', isSupporter: false },
  { name: 'User 4', image: null, totalPoints: '748', isSupporter: false },
  { name: 'User 18', image: null, totalPoints: '747', isSupporter: true },
  { name: 'User 9', image: null, totalPoints: '746', isSupporter: false },
  { name: 'User 137', image: null, totalPoints: '746', isSupporter: false },
  { name: 'User 14', image: null, totalPoints: '746', isSupporter: false },
  { name: 'User 101', image: null, totalPoints: '746', isSupporter: false },
  { name: 'User 93', image: null, totalPoints: '741', isSupporter: false },
  { name: 'User 132', image: null, totalPoints: '741', isSupporter: false },
  { name: 'User 133', image: null, totalPoints: '741', isSupporter: false },
  { name: 'User 112', image: null, totalPoints: '736', isSupporter: true },
  { name: 'User 167', image: null, totalPoints: '735', isSupporter: false },
  { name: 'User 53', image: null, totalPoints: '734', isSupporter: false },
  { name: 'User 187', image: null, totalPoints: '732', isSupporter: false },
  { name: 'User 33', image: null, totalPoints: '731', isSupporter: false },
  { name: 'User 181', image: null, totalPoints: '731', isSupporter: false },
  { name: 'User 48', image: null, totalPoints: '722', isSupporter: false },
  { name: 'User 176', image: null, totalPoints: '719', isSupporter: false },
  { name: 'User 114', image: null, totalPoints: '717', isSupporter: false },
  { name: 'User 172', image: null, totalPoints: '716', isSupporter: false },
  { name: 'User 191', image: null, totalPoints: '715', isSupporter: false },
  { name: 'User 80', image: null, totalPoints: '713', isSupporter: false },
  { name: 'User 131', image: null, totalPoints: '712', isSupporter: false },
  { name: 'User 178', image: null, totalPoints: '709', isSupporter: false },
  { name: 'User 26', image: null, totalPoints: '707', isSupporter: false },
  { name: 'User 44', image: null, totalPoints: '707', isSupporter: false },
  { name: 'User 19', image: null, totalPoints: '707', isSupporter: false },
  { name: 'User 144', image: null, totalPoints: '705', isSupporter: false },
  { name: 'User 113', image: null, totalPoints: '702', isSupporter: false },
  { name: 'User 60', image: null, totalPoints: '698', isSupporter: false },
  { name: 'User 184', image: null, totalPoints: '698', isSupporter: false },
  { name: 'User 130', image: null, totalPoints: '696', isSupporter: false },
  { name: 'User 193', image: null, totalPoints: '692', isSupporter: false },
  { name: 'User 52', image: null, totalPoints: '689', isSupporter: false },
  { name: 'User 123', image: null, totalPoints: '685', isSupporter: false },
  { name: 'User 115', image: null, totalPoints: '684', isSupporter: false },
  { name: 'User 185', image: null, totalPoints: '683', isSupporter: false },
  { name: 'User 182', image: null, totalPoints: '683', isSupporter: false },
  { name: 'User 77', image: null, totalPoints: '683', isSupporter: false },
  { name: 'User 28', image: null, totalPoints: '681', isSupporter: false },
  { name: 'User 183', image: null, totalPoints: '677', isSupporter: false },
  { name: 'User 196', image: null, totalPoints: '676', isSupporter: false },
  { name: 'User 58', image: null, totalPoints: '676', isSupporter: false },
  { name: 'User 81', image: null, totalPoints: '670', isSupporter: false },
  { name: 'User 129', image: null, totalPoints: '668', isSupporter: false },
  { name: 'User 152', image: null, totalPoints: '666', isSupporter: false },
  { name: 'User 20', image: null, totalPoints: '664', isSupporter: false },
  { name: 'User 70', image: null, totalPoints: '663', isSupporter: false },
  { name: 'User 49', image: null, totalPoints: '662', isSupporter: false },
  { name: 'type-challenges', image: null, totalPoints: '661', isSupporter: false },
  { name: 'User 50', image: null, totalPoints: '661', isSupporter: false },
  { name: 'User 199', image: null, totalPoints: '660', isSupporter: false },
  { name: 'User 59', image: null, totalPoints: '659', isSupporter: false },
  { name: 'User 194', image: null, totalPoints: '655', isSupporter: false },
  { name: 'User 118', image: null, totalPoints: '651', isSupporter: false },
  { name: 'User 111', image: null, totalPoints: '649', isSupporter: false },
  { name: 'User 98', image: null, totalPoints: '648', isSupporter: false },
  { name: 'User 91', image: null, totalPoints: '646', isSupporter: false },
  { name: 'User 88', image: null, totalPoints: '641', isSupporter: false },
  { name: 'User 17', image: null, totalPoints: '641', isSupporter: false },
];

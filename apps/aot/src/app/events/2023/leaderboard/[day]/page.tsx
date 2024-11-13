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

const dataArray = [
  [
    {
      id: 5526,
      createdAt: new Date('2024-01-01T06:07:14.232Z'),
      user: { name: 'User 185', image: null, isSupporter: false },
    },
    {
      id: 5726,
      createdAt: new Date('2024-01-01T06:07:27.102Z'),
      user: { name: 'User 140', image: null, isSupporter: true },
    },
    {
      id: 2951,
      createdAt: new Date('2024-01-01T06:07:46.597Z'),
      user: { name: 'User 33', image: null, isSupporter: false },
    },
    {
      id: 4926,
      createdAt: new Date('2024-01-01T06:08:55.079Z'),
      user: { name: 'User 179', image: null, isSupporter: false },
    },
    {
      id: 5576,
      createdAt: new Date('2024-01-01T06:15:10.652Z'),
      user: { name: 'User 88', image: null, isSupporter: false },
    },
    {
      id: 10026,
      createdAt: new Date('2024-01-01T06:16:46.497Z'),
      user: { name: 'User 119', image: null, isSupporter: false },
    },
    {
      id: 4976,
      createdAt: new Date('2024-01-01T06:26:07.682Z'),
      user: { name: 'User 69', image: null, isSupporter: true },
    },
    {
      id: 5601,
      createdAt: new Date('2024-01-01T06:26:25.907Z'),
      user: { name: 'User 155', image: null, isSupporter: false },
    },
    {
      id: 8676,
      createdAt: new Date('2024-01-01T06:32:46.898Z'),
      user: { name: 'User 87', image: null, isSupporter: false },
    },
    {
      id: 5376,
      createdAt: new Date('2024-01-01T06:33:38.377Z'),
      user: { name: 'User 67', image: null, isSupporter: true },
    },
    {
      id: 2051,
      createdAt: new Date('2024-01-01T06:34:37.389Z'),
      user: { name: 'User 61', image: null, isSupporter: false },
    },
    {
      id: 5801,
      createdAt: new Date('2024-01-01T06:35:33.828Z'),
      user: { name: 'User 172', image: null, isSupporter: false },
    },
    {
      id: 9151,
      createdAt: new Date('2024-01-01T06:37:58.711Z'),
      user: { name: 'User 31', image: null, isSupporter: false },
    },
    {
      id: 1851,
      createdAt: new Date('2024-01-01T06:41:03.335Z'),
      user: { name: 'User 167', image: null, isSupporter: false },
    },
    {
      id: 8376,
      createdAt: new Date('2024-01-01T06:43:33.799Z'),
      user: { name: 'User 156', image: null, isSupporter: false },
    },
    {
      id: 8651,
      createdAt: new Date('2024-01-01T06:45:32.320Z'),
      user: { name: 'User 57', image: null, isSupporter: true },
    },
    {
      id: 9401,
      createdAt: new Date('2024-01-01T06:47:29.915Z'),
      user: { name: 'User 108', image: null, isSupporter: false },
    },
    {
      id: 7626,
      createdAt: new Date('2024-01-01T06:52:10.386Z'),
      user: { name: 'User 118', image: null, isSupporter: false },
    },
    {
      id: 5851,
      createdAt: new Date('2024-01-01T06:53:00.897Z'),
      user: { name: 'User 191', image: null, isSupporter: false },
    },
    {
      id: 1951,
      createdAt: new Date('2024-01-01T06:57:06.724Z'),
      user: { name: 'User 65', image: null, isSupporter: true },
    },
    {
      id: 1601,
      createdAt: new Date('2024-01-01T07:00:56.297Z'),
      user: { name: 'User 189', image: null, isSupporter: false },
    },
    {
      id: 3076,
      createdAt: new Date('2024-01-01T07:03:32.887Z'),
      user: { name: 'User 197', image: null, isSupporter: false },
    },
    {
      id: 2126,
      createdAt: new Date('2024-01-01T07:03:34.855Z'),
      user: { name: 'User 126', image: null, isSupporter: false },
    },
    {
      id: 5276,
      createdAt: new Date('2024-01-01T07:04:50.196Z'),
      user: { name: 'User 120', image: null, isSupporter: true },
    },
    {
      id: 6201,
      createdAt: new Date('2024-01-01T07:16:25.813Z'),
      user: { name: 'User 182', image: null, isSupporter: false },
    },
    {
      id: 2301,
      createdAt: new Date('2024-01-01T07:17:13.035Z'),
      user: { name: 'User 137', image: null, isSupporter: false },
    },
    {
      id: 2826,
      createdAt: new Date('2024-01-01T07:19:34.175Z'),
      user: { name: 'User 18', image: null, isSupporter: false },
    },
    {
      id: 3776,
      createdAt: new Date('2024-01-01T07:24:54.836Z'),
      user: { name: 'User 130', image: null, isSupporter: false },
    },
    {
      id: 251,
      createdAt: new Date('2024-01-01T07:26:20.262Z'),
      user: { name: 'User 148', image: null, isSupporter: true },
    },
    {
      id: 3826,
      createdAt: new Date('2024-01-01T07:29:49.034Z'),
      user: { name: 'User 93', image: null, isSupporter: false },
    },
    {
      id: 2451,
      createdAt: new Date('2024-01-01T07:35:14.755Z'),
      user: { name: 'User 85', image: null, isSupporter: false },
    },
    {
      id: 3201,
      createdAt: new Date('2024-01-01T07:36:33.458Z'),
      user: { name: 'User 176', image: null, isSupporter: false },
    },
    {
      id: 3126,
      createdAt: new Date('2024-01-01T07:36:33.484Z'),
      user: { name: 'User 157', image: null, isSupporter: false },
    },
    {
      id: 7301,
      createdAt: new Date('2024-01-01T07:39:24.972Z'),
      user: { name: 'User 60', image: null, isSupporter: true },
    },
    {
      id: 6076,
      createdAt: new Date('2024-01-01T07:43:46.197Z'),
      user: { name: 'User 14', image: null, isSupporter: false },
    },
    {
      id: 8951,
      createdAt: new Date('2024-01-01T07:44:51.725Z'),
      user: { name: 'User 12', image: null, isSupporter: false },
    },
    {
      id: 8551,
      createdAt: new Date('2024-01-01T07:48:42.941Z'),
      user: { name: 'User 135', image: null, isSupporter: false },
    },
    {
      id: 6876,
      createdAt: new Date('2024-01-01T07:49:26.187Z'),
      user: { name: 'User 97', image: null, isSupporter: true },
    },
    {
      id: 7151,
      createdAt: new Date('2024-01-01T07:54:43.762Z'),
      user: { name: 'User 158', image: null, isSupporter: false },
    },
    {
      id: 8576,
      createdAt: new Date('2024-01-01T07:54:56.399Z'),
      user: { name: 'User 138', image: null, isSupporter: false },
    },
    {
      id: 126,
      createdAt: new Date('2024-01-01T07:55:33.472Z'),
      user: { name: 'User 80', image: null, isSupporter: false },
    },
    {
      id: 6001,
      createdAt: new Date('2024-01-01T07:58:55.075Z'),
      user: { name: 'User 4', image: null, isSupporter: false },
    },
    {
      id: 4601,
      createdAt: new Date('2024-01-01T08:03:03.945Z'),
      user: { name: 'User 149', image: null, isSupporter: true },
    },
    {
      id: 901,
      createdAt: new Date('2024-01-01T08:05:35.017Z'),
      user: { name: 'User 34', image: null, isSupporter: false },
    },
    {
      id: 401,
      createdAt: new Date('2024-01-01T08:08:35.015Z'),
      user: { name: 'User 70', image: null, isSupporter: false },
    },
    {
      id: 1301,
      createdAt: new Date('2024-01-01T08:13:19.143Z'),
      user: { name: 'type-challenges', image: null, isSupporter: false },
    },
    {
      id: 7476,
      createdAt: new Date('2024-01-01T08:14:18.830Z'),
      user: { name: 'User 152', image: null, isSupporter: false },
    },
    {
      id: 2976,
      createdAt: new Date('2024-01-01T08:29:06.510Z'),
      user: { name: 'User 114', image: null, isSupporter: false },
    },
    {
      id: 1551,
      createdAt: new Date('2024-01-01T08:29:46.343Z'),
      user: { name: 'User 198', image: null, isSupporter: true },
    },
    {
      id: 9551,
      createdAt: new Date('2024-01-01T08:30:26.593Z'),
      user: { name: 'User 27', image: null, isSupporter: false },
    },
    {
      id: 7801,
      createdAt: new Date('2024-01-01T08:36:00.218Z'),
      user: { name: 'User 46', image: null, isSupporter: false },
    },
    {
      id: 7251,
      createdAt: new Date('2024-01-01T08:36:51.339Z'),
      user: { name: 'User 38', image: null, isSupporter: false },
    },
    {
      id: 6826,
      createdAt: new Date('2024-01-01T08:40:49.539Z'),
      user: { name: 'User 186', image: null, isSupporter: false },
    },
    {
      id: 326,
      createdAt: new Date('2024-01-01T08:41:37.172Z'),
      user: { name: 'User 49', image: null, isSupporter: false },
    },
    {
      id: 3951,
      createdAt: new Date('2024-01-01T08:42:38.632Z'),
      user: { name: 'User 35', image: null, isSupporter: true },
    },
    {
      id: 4776,
      createdAt: new Date('2024-01-01T08:43:07.803Z'),
      user: { name: 'User 16', image: null, isSupporter: false },
    },
    {
      id: 7551,
      createdAt: new Date('2024-01-01T08:44:06.253Z'),
      user: { name: 'User 141', image: null, isSupporter: false },
    },
    {
      id: 4626,
      createdAt: new Date('2024-01-01T08:44:14.409Z'),
      user: { name: 'User 21', image: null, isSupporter: false },
    },
    {
      id: 5501,
      createdAt: new Date('2024-01-01T08:55:19.195Z'),
      user: { name: 'User 62', image: null, isSupporter: false },
    },
    {
      id: 9051,
      createdAt: new Date('2024-01-01T08:57:28.236Z'),
      user: { name: 'User 63', image: null, isSupporter: false },
    },
    {
      id: 2026,
      createdAt: new Date('2024-01-01T08:58:13.363Z'),
      user: { name: 'User 115', image: null, isSupporter: true },
    },
    {
      id: 7926,
      createdAt: new Date('2024-01-01T09:03:48.313Z'),
      user: { name: 'User 133', image: null, isSupporter: false },
    },
    {
      id: 5251,
      createdAt: new Date('2024-01-01T09:04:06.796Z'),
      user: { name: 'User 7', image: null, isSupporter: false },
    },
    {
      id: 2776,
      createdAt: new Date('2024-01-01T09:05:39.729Z'),
      user: { name: 'User 78', image: null, isSupporter: false },
    },
    {
      id: 9251,
      createdAt: new Date('2024-01-01T09:07:01.809Z'),
      user: { name: 'User 8', image: null, isSupporter: false },
    },
    {
      id: 2626,
      createdAt: new Date('2024-01-01T09:07:15.038Z'),
      user: { name: 'User 53', image: null, isSupporter: false },
    },
  ],
  [
    {
      id: 1001,
      createdAt: new Date('2024-01-01T10:00:14.232Z'),
      user: { name: 'User 201', image: null, isSupporter: false },
    },
    {
      id: 1002,
      createdAt: new Date('2024-01-01T10:01:27.102Z'),
      user: { name: 'User 202', image: null, isSupporter: true },
    },
    {
      id: 1003,
      createdAt: new Date('2024-01-01T10:02:46.597Z'),
      user: { name: 'User 203', image: null, isSupporter: false },
    },
    {
      id: 1004,
      createdAt: new Date('2024-01-01T10:03:55.079Z'),
      user: { name: 'User 204', image: null, isSupporter: false },
    },
    {
      id: 1005,
      createdAt: new Date('2024-01-01T10:04:10.652Z'),
      user: { name: 'User 205', image: null, isSupporter: false },
    },
    {
      id: 1006,
      createdAt: new Date('2024-01-01T10:05:46.497Z'),
      user: { name: 'User 206', image: null, isSupporter: true },
    },
    {
      id: 1007,
      createdAt: new Date('2024-01-01T10:06:07.682Z'),
      user: { name: 'User 207', image: null, isSupporter: false },
    },
    {
      id: 1008,
      createdAt: new Date('2024-01-01T10:07:25.907Z'),
      user: { name: 'User 208', image: null, isSupporter: false },
    },
    {
      id: 1009,
      createdAt: new Date('2024-01-01T10:08:46.898Z'),
      user: { name: 'User 209', image: null, isSupporter: false },
    },
    {
      id: 1010,
      createdAt: new Date('2024-01-01T10:09:38.377Z'),
      user: { name: 'User 210', image: null, isSupporter: true },
    },
    {
      id: 1011,
      createdAt: new Date('2024-01-01T10:10:37.389Z'),
      user: { name: 'User 211', image: null, isSupporter: false },
    },
    {
      id: 1012,
      createdAt: new Date('2024-01-01T10:11:33.828Z'),
      user: { name: 'User 212', image: null, isSupporter: false },
    },
    {
      id: 1013,
      createdAt: new Date('2024-01-01T10:12:58.711Z'),
      user: { name: 'User 213', image: null, isSupporter: false },
    },
    {
      id: 1014,
      createdAt: new Date('2024-01-01T10:13:03.335Z'),
      user: { name: 'User 214', image: null, isSupporter: false },
    },
    {
      id: 1015,
      createdAt: new Date('2024-01-01T10:14:33.799Z'),
      user: { name: 'User 215', image: null, isSupporter: true },
    },
    {
      id: 1016,
      createdAt: new Date('2024-01-01T10:15:32.320Z'),
      user: { name: 'User 216', image: null, isSupporter: false },
    },
    {
      id: 1017,
      createdAt: new Date('2024-01-01T10:16:29.915Z'),
      user: { name: 'User 217', image: null, isSupporter: false },
    },
    {
      id: 1018,
      createdAt: new Date('2024-01-01T10:17:10.386Z'),
      user: { name: 'User 218', image: null, isSupporter: false },
    },
    {
      id: 1019,
      createdAt: new Date('2024-01-01T10:18:00.897Z'),
      user: { name: 'User 219', image: null, isSupporter: false },
    },
    {
      id: 1020,
      createdAt: new Date('2024-01-01T10:19:06.724Z'),
      user: { name: 'User 220', image: null, isSupporter: true },
    },
    // ... continuing with the pattern
    {
      id: 1098,
      createdAt: new Date('2024-01-01T12:57:06.724Z'),
      user: { name: 'User 298', image: null, isSupporter: false },
    },
    {
      id: 1099,
      createdAt: new Date('2024-01-01T12:58:06.724Z'),
      user: { name: 'User 299', image: null, isSupporter: true },
    },
    {
      id: 1100,
      createdAt: new Date('2024-01-01T12:59:06.724Z'),
      user: { name: 'User 300', image: null, isSupporter: false },
    },
  ],
];

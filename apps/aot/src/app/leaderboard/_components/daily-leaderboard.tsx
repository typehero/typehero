import { prisma } from '@repo/db';
import { DataTableLeaderboard } from '@repo/ui/components/data-table-leaderboard';
import { ADVENT_CHALLENGE_IDS, LEADERBOARD_RANKING_LIMIT } from '~/app/leaderboard/constants';
import { dailyLeaderboardColumns } from './columns';

export const dynamic = 'force-dynamic';

const getFirst100SubmissionsRanked = async (adventDay: number) => {
  const challengeId = ADVENT_CHALLENGE_IDS[adventDay - 1];
  const submissions = await prisma.submission.findMany({
    select: { id: true, createdAt: true, user: { select: { name: true, image: true } } },
    where: {
      challengeId,
      isSuccessful: true,
    },
    distinct: ['userId'],
    orderBy: {
      createdAt: 'asc',
    },
    take: LEADERBOARD_RANKING_LIMIT,
  });
  return submissions;
};

export default async function DailyLeaderboard({ adventDay }: { adventDay: number }) {
  const first100SubmissionsRanked = await getFirst100SubmissionsRanked(adventDay);

  return (
    <div className="p-4">
      <DataTableLeaderboard data={first100SubmissionsRanked} columns={dailyLeaderboardColumns} />
    </div>
  );
}

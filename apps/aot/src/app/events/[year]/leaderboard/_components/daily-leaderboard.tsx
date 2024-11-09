import { prisma } from '@repo/db';
import { DataTableLeaderboard } from '@repo/ui/components/data-table-leaderboard';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { dailyLeaderboardColumns } from './columns';
import { getAotChallengeIdForAdventDay } from '../getAotChallengeIds';

export const dynamic = 'force-dynamic';

const getFirst100SubmissionsRanked = async (adventYear: string, adventDay: string) => {
  // We already checked adventDay is valid in day/[day]/layout.tsx
  const challengeId = await getAotChallengeIdForAdventDay(adventYear, adventDay)!;
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

export default async function DailyLeaderboard({
  adventYear,
  adventDay,
}: {
  adventYear: string;
  adventDay: string;
}) {
  const first100SubmissionsRanked = await getFirst100SubmissionsRanked(adventYear, adventDay);

  return (
    <div className="p-4">
      <DataTableLeaderboard data={first100SubmissionsRanked} columns={dailyLeaderboardColumns} />
    </div>
  );
}

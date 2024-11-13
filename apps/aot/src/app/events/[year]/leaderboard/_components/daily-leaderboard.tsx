import { prisma } from '@repo/db';
import { DataTableLeaderboard } from '@repo/ui/components/data-table-leaderboard';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { dailyLeaderboardColumns } from './columns';
import { getAotChallengeIdForAdventDay } from '../getAotChallengeIds';
import { formatDuration, intervalToDuration } from 'date-fns';
import { time } from 'console';

export const dynamic = 'force-dynamic';

export const getFirst100SubmissionsRanked = async (adventYear: string, adventDay: string) => {
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
  const submissionsWithFlatUsers = submissions.map((s) => ({
    timeToComplete: calculateDuration({ year: adventYear, day: adventDay }, s.createdAt),
    //todo
    isSupporter: Math.random() > 0.8 ? true : false,
    ...s.user,
  }));
  return submissionsWithFlatUsers;
};

const calculateDuration = (start: { year: string; day: string }, end: Date) => {
  const duration = intervalToDuration({
    start: new Date(Number(start.year), 11, Number(start.day)),
    end,
  });
  console.log({
    start: new Date(Number(start.year), 11, Number(start.day)),
    end,
  });
  return formatDuration(duration);
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

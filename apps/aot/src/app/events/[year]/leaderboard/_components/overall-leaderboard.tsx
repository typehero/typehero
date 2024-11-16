import { Prisma, prisma } from '@repo/db';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { DataTableLeaderboard } from '@repo/ui/components/data-table-leaderboard';
import { overallLeaderboardColumns, type OverallLeaderboardEntry } from './columns';
import { getNextAdventDay } from '~/utils/time-utils';
import { redisClient } from '@repo/redis';
import { getAotChallengeIdsSoFar } from '../getAotChallengeIds';

export const dynamic = 'force-dynamic';

async function getOverallLeaderboard(year: number, isPast: boolean) {
  if (!isPast) {
    const cachedRanking = await redisClient.get('aot-overall-leaderboard');

    if (cachedRanking) {
      return JSON.parse(cachedRanking) as OverallLeaderboardEntry[];
    }
  }

  const challengeIdsSoFar = await getAotChallengeIdsSoFar(year);

  const rankingPromise = prisma.$queryRaw<OverallLeaderboardEntry[]>`
  SELECT
    u.name,
    u.image,
    u.bio,
    CAST(SUM(r.points) AS SIGNED) AS totalPoints,
    GROUP_CONCAT(DISTINCT ro.role) AS roles
  FROM
    User u
  LEFT JOIN
    _RoleToUser rtu ON u.id = rtu.B
  LEFT JOIN
    Role ro ON rtu.A = ro.id
  JOIN
    (
      SELECT
        userId,
        101 - \`rank\` AS points
      FROM
        (
          SELECT
            userId,
            challengeId,
            ROW_NUMBER() OVER (PARTITION BY challengeId ORDER BY MIN(createdAt)) AS \`rank\`
          FROM Submission
          WHERE challengeId IN (${Prisma.join(challengeIdsSoFar)}) AND isSuccessful = 1
          GROUP BY userId, challengeId
        ) AS RankedSubmissions
      WHERE \`rank\` <= ${LEADERBOARD_RANKING_LIMIT}
    ) r ON u.id = r.userId
  WHERE u.status = 'ACTIVE'
  GROUP BY r.userId, u.name, u.image, u.bio
  ORDER BY totalPoints DESC
  LIMIT ${LEADERBOARD_RANKING_LIMIT};`;

  // Prisma doesn't suppport distinct for .count()...
  const challengeIdToday = challengeIdsSoFar.at(-1);
  const numberOfSubmissionsTodayPromise = prisma.$queryRaw<[{ count: number }]>`
    SELECT COUNT(DISTINCT userId) as count
    FROM Submission
    WHERE challengeId = ${challengeIdToday}
    AND isSuccessful = 1`;

  const [ranking, [{ count: numberOfSubmissionsToday }]] = await Promise.all([
    rankingPromise,
    numberOfSubmissionsTodayPromise,
  ]);

  // Once we have top 100 for today, we can cache until midnight (next challenge release)
  if (!isPast && Number(numberOfSubmissionsToday) >= LEADERBOARD_RANKING_LIMIT) {
    await redisClient.set(
      'aot-overall-leaderboard',
      JSON.stringify(ranking, (_, value) => (typeof value === 'bigint' ? value.toString() : value)),
      { PXAT: getNextAdventDay() },
    );
  }

  return ranking;
}

export default async function OverallLeaderboard({
  year,
  isPast = false,
}: {
  year: number;
  isPast?: boolean;
}) {
  const top100Ranking = await getOverallLeaderboard(year, isPast);

  return (
    <div className="p-4">
      <DataTableLeaderboard data={top100Ranking} columns={overallLeaderboardColumns} />
    </div>
  );
}

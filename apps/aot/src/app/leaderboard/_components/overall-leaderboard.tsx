import { Prisma, prisma } from '@repo/db';
import { ADVENT_CHALLENGE_IDS, LEADERBOARD_RANKING_LIMIT } from '../constants';
import { DataTableLeaderboard } from '@repo/ui/components/data-table-leaderboard';
import { overallLeaderboardColumns, type OverallLeaderboardEntry } from './columns';

async function getOverallLeaderboard(currentAdventDay: number) {
  const challengeIdsSoFar = ADVENT_CHALLENGE_IDS.slice(0, currentAdventDay);

  const ranking = await prisma.$queryRaw<OverallLeaderboardEntry[]>`
  SELECT
    u.name,
    u.image,
    SUM(r.points) AS totalPoints
  FROM
    User u
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
  GROUP BY r.userId, u.name, u.image
  ORDER BY totalPoints DESC
  LIMIT ${LEADERBOARD_RANKING_LIMIT};
`;

  return ranking;
}

export default async function OverallLeaderboard({
  currentAdventDay,
}: {
  currentAdventDay: number;
}) {
  const top100Ranking = await getOverallLeaderboard(currentAdventDay);
  return (
    <div className="p-4">
      <DataTableLeaderboard data={top100Ranking} columns={overallLeaderboardColumns} />
    </div>
  );
}

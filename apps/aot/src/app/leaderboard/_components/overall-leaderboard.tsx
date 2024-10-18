import { Prisma, prisma } from '@repo/db';
import { ADVENT_CHALLENGE_IDS, LEADERBOARD_RANKING_LIMIT } from '../constants';

interface RankingResult {
  name: string;
  totalPoints: number;
}

async function getTop100SubmissionsToday(currentAdventDay: number) {
  // I tried setting up TypedSQL from Prisma: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql
  // But it was getting stuck trying to load schema.prisma for some reason
  // Would love some help so we can get inferred typing for this!
  const challengeIdsSoFar = ADVENT_CHALLENGE_IDS.slice(0, currentAdventDay);

  const ranking = await prisma.$queryRaw<RankingResult[]>`
  WITH RankedSubmissionsForAllChallenges AS (
  	SELECT
  	  userId,
  	  challengeId,
  	  ROW_NUMBER() OVER (PARTITION BY challengeId ORDER BY MIN(createdAt)) AS \`rank\`
  	FROM Submission
  	WHERE challengeId IN (${Prisma.join(challengeIdsSoFar)})
  	  AND isSuccessful = 1
  	GROUP BY userId, challengeId
  ),
  RankingWithPointsForAllChallenges AS (
  	SELECT
  	  userId,
  	  101 - \`rank\` AS points
  	FROM RankedSubmissionsForAllChallenges
  	WHERE \`rank\` <= ${LEADERBOARD_RANKING_LIMIT}
  	ORDER BY challengeId, \`rank\`
  )
  SELECT
    u.name,
    SUM(r.points) AS totalPoints
  FROM RankingWithPointsForAllChallenges r
  JOIN User u ON u.id = r.userId
  GROUP BY r.userId
  ORDER BY totalPoints DESC
  LIMIT ${LEADERBOARD_RANKING_LIMIT};`;

  return ranking; // query to return top 100 of each day so far
}

export default async function OverallLeaderboard({
  currentAdventDay,
}: {
  currentAdventDay: number;
}) {
  const top100Ranking = await getTop100SubmissionsToday(currentAdventDay);
  return (
    <div className="p-4">
      <p>Overall AoT leaderboard!</p>
      <ul className="flex flex-col gap-2 font-mono">
        {top100Ranking.map((rankedUser, index) => (
          <li key={index} className="flex gap-6 border p-4">
            <p className="w-10 text-right">{index + 1})</p>
            <p className="w-10 text-right">{rankedUser.totalPoints}</p>
            <p>{rankedUser.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

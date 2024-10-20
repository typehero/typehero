import { Prisma, prisma } from '@repo/db';
import { ADVENT_CHALLENGE_IDS, LEADERBOARD_RANKING_LIMIT } from '../constants';

interface RankingResult {
  name: string;
  totalPoints: number;
}

async function getOverallLeaderboard(currentAdventDay: number) {
  const challengeIdsSoFar = ADVENT_CHALLENGE_IDS.slice(0, currentAdventDay);

  const ranking = await prisma.$queryRaw<RankingResult[]>`
  SELECT
    u.name,
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
  GROUP BY r.userId, u.name
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
      <p>Overall AoT leaderboard!</p>
      <ul className="flex flex-col gap-2 font-mono">
        {top100Ranking.map((rankedUser, index) => (
          <li key={index} className="flex gap-6 border p-4">
            <p className="w-10 text-right">{index + 1})</p>
            <p className="w-10 text-right">{Number(rankedUser.totalPoints)}</p>
            <p>{rankedUser.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

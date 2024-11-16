import { Prisma, prisma } from '@repo/db';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { getNextAdventDay } from '~/utils/time-utils';
import { redisClient } from '@repo/redis';
import { getAotChallengeIdsSoFar } from '../getAotChallengeIds';

interface OverallLeaderboardEntry {
  score: number;
  name: string;
  image: string | null;
  isSupporter: boolean;
}

export async function getOverallLeaderboard(year: number, isPast: boolean) {
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
    CAST(SUM(r.points) AS SIGNED) AS score
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
  WHERE u.status = 'ACTIVE'
  GROUP BY r.userId, u.name, u.image
  ORDER BY score DESC
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

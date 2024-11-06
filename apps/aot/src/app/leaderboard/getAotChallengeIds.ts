import { prisma } from '@repo/db';
import { getCurrentAdventDay } from '~/utils/time-utils';

export const getAotChallengeIdsSoFar = async () => {
  const currentAdventDay = getCurrentAdventDay();
  // TODO: Put leaderboard under event/[year]/leaderboard
  // pass in year from slug
  const year = new Date().getUTCFullYear();

  // Get the starting id of this year (first aot was 2023)
  const startId = (year - 2023) * 25 + 1;
  const endId = startId + currentAdventDay - 1;

  // Fetch challenges for December up to the current day in a single query
  const challengesSoFar = await prisma.trackChallenge.findMany({
    include: {
      challenge: {
        select: { id: true },
      },
    },
    where: {
      id: {
        gte: startId,
        lte: endId,
      },
    },
  });

  const challengeIdsSoFar = challengesSoFar.map((challenge) => challenge.id);

  return challengeIdsSoFar;
};

export const getAotChallengeIdForAdventDay = async (adventDay: number) => {
  const year = new Date().getUTCFullYear().toString();
  const day = String(adventDay);
  const slug = getAotSlug({ year, day });

  // Fetch the challenge for the specified day
  const challenge = await prisma.challenge.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  return challenge?.id;
};

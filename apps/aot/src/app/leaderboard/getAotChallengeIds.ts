import { prisma } from '@repo/db';
import { getAotSlug } from '~/utils/getAotSlug';
import { getCurrentAdventDay } from '~/utils/time-utils';

export const getAotChallengeIdsSoFar = async () => {
  const currentAdventDay = getCurrentAdventDay();
  // TODO: Put leaderboard under event/[year]/leaderboard
  // pass in year from slug
  const year = new Date().getUTCFullYear();

  // Fetch challenges for December up to the current day in a single query
  const challengesSoFar = await prisma.track.findFirstOrThrow({
    where: {
      slug: `advent-of-typescript-${year}`,
    },
    select: {
      trackChallenges: {
        where: {
          orderId: {
            gte: 0,
            lte: currentAdventDay - 1,
          },
        },
      },
    },
  });

  const challengeIdsSoFar = challengesSoFar.trackChallenges.map(
    (trackChallenge) => trackChallenge.challengeId,
  );

  return challengeIdsSoFar;
};

export const getAotChallengeIdForAdventDay = async (adventDay: number) => {
  // TODO: Put leaderboard under event/[year]/leaderboard
  // pass in year from slug
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

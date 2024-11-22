import { prisma } from '@repo/db';
import { getAotSlug } from '~/utils/getAotSlug';
import { getCurrentAdventDay } from '~/utils/time-utils';

export const getAotChallengeIdsSoFar = async (year: number) => {
  const currentAdventDay = getCurrentAdventDay(year);

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

export const getAotChallengeIdForAdventDay = async (year: string, day: string) => {
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

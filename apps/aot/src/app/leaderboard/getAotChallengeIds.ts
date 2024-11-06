import { prisma } from '@repo/db';
import { getAotSlug } from '~/utils/getAotSlug';
import { getCurrentAdventDay } from '~/utils/time-utils';

export const getAotChallengeIdsSoFar = async () => {
  const currentAdventDay = getCurrentAdventDay();
  const year = new Date().getUTCFullYear().toString();
  const day = String(currentAdventDay);
  const endSlug = getAotSlug({ year, day });

  // Fetch challenges for December up to the current day in a single query
  const challengesSoFar = await prisma.challenge.findMany({
    where: {
      slug: {
        gte: `${year}-1`,
        lte: endSlug,
      },
    },
    select: {
      id: true,
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

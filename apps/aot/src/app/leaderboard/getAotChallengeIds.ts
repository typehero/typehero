import { prisma } from '@repo/db';
import { getAotSlug } from '~/utils/getAotSlug';
import { getCurrentAdventDay } from '~/utils/time-utils';

export const getAotChallengeIdsSoFar = async () => {
  const currentAdventDay = getCurrentAdventDay();
  const year = new Date().getUTCFullYear().toString();
  const day = String(currentAdventDay).padStart(2, '0');
  const endSlug = getAotSlug({ year, day });

  // Fetch challenges for December up to the current day in a single query
  const challengeIdsSoFar = await prisma.challenge.findMany({
    where: {
      slug: {
        gte: `${year}-01`,
        lte: endSlug,
      },
    },
    orderBy: {
      slug: 'asc',
    },
    select: {
      id: true,
    },
  });

  return challengeIdsSoFar;
};

export const getAotChallengeIdForAdventDay = async (adventDay: number) => {
  const year = new Date().getUTCFullYear().toString();
  const day = String(adventDay).padStart(2, '0');
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

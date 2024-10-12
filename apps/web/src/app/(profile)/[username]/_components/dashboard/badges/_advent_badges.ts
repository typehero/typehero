import type {AllBadgeObjs, BadgeFn} from "../_actions";
import {prisma} from "@repo/db";

export interface AdventChallenges {
  trackChallenges: { challenge: { submission: { isSuccessful: boolean }[] } }[];
}

export const AotBadgeKeys = ['aot-2023-bronze', 'aot-2023-silver', 'aot-2023-gold', 'aot-2023-platinum'] as const;

export type AotBadges = typeof AotBadgeKeys[number];

export const adventBadgesFn: BadgeFn =
  async ({
           userId,
           badges,
         }: {
    userId: string;
    badges: AllBadgeObjs;
  }): Promise<AllBadgeObjs> => {
    const advent: AdventChallenges | null = await AdventRetrieveData(userId);
    return await AdventChallengeFn(badges, advent);
  };
export async function AdventRetrieveData(userId: string) {
  const advent: AdventChallenges | null = await prisma.track.findFirst({
    where: {
      slug: 'advent-of-typescript-2023',
    },
    include: {
      trackChallenges: {
        orderBy: {
          orderId: 'asc',
        },
        include: {
          challenge: {
            include: {
              submission: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
      enrolledUsers: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });
  return advent;
}

export const CreateAdventBadges = (slug: AotBadges, name: string) => {
  return {
    [slug]: {
      slug,
      name,
      shortName: 'Advent'
    }
  }
}

export const AdventChallengeFn = async (badges: AllBadgeObjs, advent: AdventChallenges | null) => {
  // Advent Badge Logic
  const numberOfAttemptedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return (trackChallenge.challenge.submission?.length ?? 0) > 0;
    }).length ?? 0;

  if (numberOfAttemptedHolidayChallenges > 0) {
    Object.assign(badges, CreateAdventBadges('aot-2023-bronze', 'Advent of TypeScript 2023 Bronze'));
  }

  const numberOfCompletedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return trackChallenge.challenge.submission?.some((submission) => submission.isSuccessful);
    }).length ?? 0;
  let badgeLevel: 'gold' | 'platinum' | 'silver' | undefined;
  if (numberOfCompletedHolidayChallenges >= 5) {
    badgeLevel = 'silver';
    Object.assign(badges, CreateAdventBadges('aot-2023-silver', 'Advent of TypeScript 2023 Silver'));
  }
  if (numberOfCompletedHolidayChallenges >= 15) {
    badgeLevel = 'gold';
    Object.assign(badges, CreateAdventBadges('aot-2023-gold', 'Advent of TypeScript 2023 Gold'));
  }
  if (numberOfCompletedHolidayChallenges >= 25) {
    badgeLevel = 'platinum';
  }
  if (badgeLevel) {
    Object.assign(badges, CreateAdventBadges(
      `aot-2023-${badgeLevel}`,
      `Advent of TypeScript 2023 ${badgeLevel[0]}${badgeLevel.substring(1)}`));
  }
  return badges;
};



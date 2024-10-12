import type {AllBadgeObjs, AllBadges, BadgeFn} from "../_actions";
import {prisma} from "@repo/db";

export interface AdventChallenges {
  trackChallenges: { challenge: { submission: { isSuccessful: boolean }[] } }[];
}

export type AotBadges =
// eslint-disable-next-line @typescript-eslint/sort-type-constituents
  'aot-2023-bronze' | 'aot-2023-silver' | 'aot-2023-gold' | 'aot-2023-platinum';

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
export const AdventChallengeFn = async (badges: AllBadgeObjs, advent: AdventChallenges | null) => {
  // Advent Badge Logic
  const numberOfAttemptedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return (trackChallenge.challenge.submission?.length ?? 0) > 0;
    }).length ?? 0;

  if (numberOfAttemptedHolidayChallenges > 0) {
    badges["aot-2023-bronze"] = {
      slug: 'aot-2023-bronze',
      name: 'Advent of TypeScript 2023 Bronze',
      shortName: 'Advent',
    };
  }

  const numberOfCompletedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return trackChallenge.challenge.submission?.some((submission) => submission.isSuccessful);
    }).length ?? 0;

  if (numberOfCompletedHolidayChallenges >= 5) {
    badges["aot-2023-silver"] = {
      slug: 'aot-2023-silver',
      name: 'Advent of TypeScript 2023 Silver',
      shortName: 'Advent',
    };
  }

  if (numberOfCompletedHolidayChallenges >= 15) {
    badges["aot-2023-gold"] = {
      slug: 'aot-2023-gold',
      name: 'Advent of TypeScript 2023 Gold',
      shortName: 'Advent',
    };
  }

  if (numberOfCompletedHolidayChallenges >= 25) {
    badges["aot-2023-platinum"] = {
      slug: 'aot-2023-platinum',
      name: 'Advent of TypeScript 2023 Platinum',
      shortName: 'Advent',
    };
  }
  return badges;
};



import type {AllBadgeObjs, BadgeFn} from "../_actions";
import {prisma} from "@repo/db";
import type {DifficultyBadges} from "~/app/(profile)/[username]/_components/dashboard/badges/_difficulty_badges";
import type {SolutionBadges} from "~/app/(profile)/[username]/_components/dashboard/badges/_shared_solutions_badges";

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

export const CreateAdventBadges = (slug: AotBadges | DifficultyBadges | SolutionBadges): slug is AotBadges => {
  const badgeColor = slug.split('-')[2];
  const badgeLevel = `${badgeColor[0].toUpperCase()}${badgeColor.substring(1)}`
  return {
    [slug]: {
      slug,
      name: `Advent of Typescript 2023 ${badgeLevel}`,
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
    Object.assign(badges, CreateAdventBadges('aot-2023-bronze'));
  }

  const numberOfCompletedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return trackChallenge.challenge.submission?.some((submission) => submission.isSuccessful);
    }).length ?? 0;
  let badgeLevel: 'gold' | 'platinum' | 'silver' | undefined;
  if (numberOfCompletedHolidayChallenges >= 5) {
    badgeLevel = 'silver';
    Object.assign(badges, CreateAdventBadges('aot-2023-silver'));
  }
  if (numberOfCompletedHolidayChallenges >= 15) {
    badgeLevel = 'gold';
    Object.assign(badges, CreateAdventBadges('aot-2023-gold'));
  }
  if (numberOfCompletedHolidayChallenges >= 25) {
    badgeLevel = 'platinum';
  }
  if (badgeLevel) {
    Object.assign(badges, CreateAdventBadges(
      `aot-2023-${badgeLevel}`));
  }
  return badges;
};



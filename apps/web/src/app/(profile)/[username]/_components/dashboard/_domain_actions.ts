'use server';

import type { AllBadges, BadgeLevels } from './_actions';

export interface Difficulty {
  Difficulty: string;
  TotalCompleted: number;
}

export interface SharedTotals {
  TotalCompleted: number;
}

export interface AdventChallenges {
  trackChallenges: { challenge: { submission: { isSuccessful: boolean }[] } }[];
}

export const AdventChallengeFn = async (badges: AllBadges[], advent: AdventChallenges | null) => {
  // Advent Badge Logic
  const numberOfAttemptedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return (trackChallenge.challenge.submission?.length ?? 0) > 0;
    }).length ?? 0;

  if (numberOfAttemptedHolidayChallenges > 0) {
    badges.push({
      slug: 'aot-2023-bronze',
      name: 'Advent of TypeScript 2023 Bronze',
      shortName: 'Advent',
    });
  }

  const numberOfCompletedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return trackChallenge.challenge.submission?.some((submission) => submission.isSuccessful);
    }).length ?? 0;

  if (numberOfCompletedHolidayChallenges >= 5) {
    badges.push({
      slug: 'aot-2023-silver',
      name: 'Advent of TypeScript 2023 Silver',
      shortName: 'Advent',
    });
  }

  if (numberOfCompletedHolidayChallenges >= 15) {
    badges.push({
      slug: 'aot-2023-gold',
      name: 'Advent of TypeScript 2023 Gold',
      shortName: 'Advent',
    });
  }

  if (numberOfCompletedHolidayChallenges >= 25) {
    badges.push({
      slug: 'aot-2023-platinum',
      name: 'Advent of TypeScript 2023 Platinum',
      shortName: 'Advent',
    });
  }
};

export const DifficultyBadgesFn = async (badges: AllBadges[], query: Difficulty[]) => {
  const thresholds: { slug: BadgeLevels; threshold: number }[] = [
    { slug: 'platinum', threshold: 8 },
    { slug: 'gold', threshold: 6 },
    { slug: 'silver', threshold: 4 },
    { slug: 'bronze', threshold: 2 },
  ];
  query.forEach((currQuery) => {
    const [highestBadge] = thresholds.filter((x) => currQuery.TotalCompleted >= x.threshold);
    if (highestBadge) {
      const pascalCase = `${currQuery.Difficulty[0]}${currQuery.Difficulty.substring(
        1,
      ).toLowerCase()}`;
      badges.push({
        slug: highestBadge.slug,
        name: `Completed ${pascalCase} Difficulty Badge`,
        shortName: `Solutions`,
      });
    }
  });
};

// Have 3 likes on a SharedSolution, thresholds are given in code for bronze/silver/gold/plat
export const SharedBadgesFn = async (badges: AllBadges[], query: SharedTotals[]) => {
  const thresholds: { slug: BadgeLevels; threshold: number }[] = [
    { slug: 'platinum', threshold: 6 },
    { slug: 'gold', threshold: 4 },
    { slug: 'silver', threshold: 2 },
    { slug: 'bronze', threshold: 0 },
  ];
  const total = query?.[0]?.TotalCompleted || 0;
  const [highestBadge] = thresholds.filter((x) => total >= x.threshold);
  if (highestBadge) {
    badges.push({
      slug: highestBadge.slug,
      name: `Completed Triple Liked Shared Solution Badge`,
      shortName: `Shared`,
    });
  }
};

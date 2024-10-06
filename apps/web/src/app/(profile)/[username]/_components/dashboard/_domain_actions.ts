'use server';

import type { AllBadges } from './_actions';

// eslint-disable-next-line @typescript-eslint/sort-type-constituents
export type DifficultyCompletion = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
// eslint-disable-next-line @typescript-eslint/sort-type-constituents
export type SubmittedSolutions = 'bronze' | 'silver' | 'gold' | 'platinum';
export interface Difficulty {
  Difficulty: DifficultyCompletion;
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
  const thresholds: { difficulty: DifficultyCompletion; threshold: number }[] = [
    { difficulty: 'BEGINNER', threshold: 1 },
    { difficulty: 'EASY', threshold: 13 },
    { difficulty: 'MEDIUM', threshold: 97 },
    { difficulty: 'HARD', threshold: 54 },
    { difficulty: 'EXTREME', threshold: 17 },
  ];
  query.forEach((currQuery) => {
    const levelThreshold = thresholds.find((x) => x.difficulty.toUpperCase() === currQuery.Difficulty);
    const completedAllChallenges = levelThreshold?.threshold === Number(currQuery.TotalCompleted);
    if (completedAllChallenges) {
      const pascalCase = `${currQuery.Difficulty[0]}${currQuery.Difficulty.substring(
        1,
      ).toLowerCase()}`;
      badges.push({
        slug: currQuery.Difficulty,
        name: `Completed ${pascalCase} Difficulty Badge`,
        shortName: currQuery.Difficulty?.toLowerCase(),
      });
    }
  });
};

export const SharedBadgesFn = async (badges: AllBadges[], query: SharedTotals[]) => {
  const thresholds: { slug: SubmittedSolutions; threshold: number }[] = [
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
      name: `Completed ${highestBadge.slug} Unique Solutions Badge`,
      shortName: `Shared`,
    });
  }
};

'use server';

import type {AllBadges, BadgeLevels} from "./_actions";

export type Difficulty = { Difficulty: string; TotalCompleted: number };
export type AdventChallenges = { trackChallenges: { challenge: { submission: any[] } }[] };

export const AdventChallengeFn = (badges: AllBadges[], advent: AdventChallenges) => {

  // Advent Badge Logic
  const numberOfAttemptedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return (trackChallenge.challenge.submission?.length ?? 0) > 0;
    }).length ?? 0;

  if (numberOfAttemptedHolidayChallenges > 0) {
    badges.push({slug: 'aot-2023-bronze', name: 'Advent of TypeScript 2023 Bronze', shortName: 'Advent'});
  }

  const numberOfCompletedHolidayChallenges =
    advent?.trackChallenges.filter((trackChallenge) => {
      return trackChallenge.challenge.submission?.some((submission) => submission.isSuccessful);
    }).length ?? 0;

  if (numberOfCompletedHolidayChallenges >= 5) {
    badges.push({slug: 'aot-2023-silver', name: 'Advent of TypeScript 2023 Silver', shortName: 'Advent' });
  }

  if (numberOfCompletedHolidayChallenges >= 15) {
    badges.push({slug: 'aot-2023-gold', name: 'Advent of TypeScript 2023 Gold', shortName: 'Advent' });
  }

  if (numberOfCompletedHolidayChallenges >= 25) {
    badges.push({slug: 'aot-2023-platinum', name: 'Advent of TypeScript 2023 Platinum', shortName: 'Advent' });
  }

}

export const DifficultyBadgesFn = (badges: AllBadges[], query: Difficulty[]) => {


  // Difficulty Level Badge Logic
  const thresholds: { slug: BadgeLevels, threshold: number }[] = [
    { slug: 'platinum', threshold: 8 },
    { slug: 'gold',     threshold: 6 },
    { slug: 'silver',   threshold: 4 },
    { slug: 'bronze',   threshold: 2 },
  ];
  query.forEach(currQuery => {
    const [highestBadge] = thresholds.filter(x => currQuery.TotalCompleted >= x.threshold);
    if (!!highestBadge) {
      badges.push({
        slug: highestBadge.slug,
        name: `Completed ${currQuery.Difficulty[0] + currQuery.Difficulty.substring(1).toLowerCase()} Difficulty Badge`,
        shortName: currQuery.Difficulty.toLowerCase()
      });
    }
  })
}

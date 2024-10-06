'use server';

import { prisma } from '@repo/db';
import type {AllBadges, BadgeFn} from "../_actions";

// eslint-disable-next-line @typescript-eslint/sort-type-constituents
export type DifficultyCompletion = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
// eslint-disable-next-line @typescript-eslint/sort-type-constituents
export type SolutionBadges = 'bronze' | 'silver' | 'gold' | 'platinum';
export interface Difficulty {
  Difficulty: DifficultyCompletion;
  TotalCompleted: number;
}

export interface SharedTotals {
  TotalCompleted: number;
}

export const sharedSolutionsBadgesFn: BadgeFn =
  async ({
           userId,
           badges,
         }: {
    userId: string;
    badges: AllBadges[];
  }) => {
    // Shared Solutions Badges
    const sharedSolutions: SharedTotals[] | null = await SharedSolutionRetrieveData(userId);
    await SharedBadgesFn(badges, sharedSolutions ?? []);
  };

export async function SharedSolutionRetrieveData(userId: string) {
  const data: SharedTotals[] | null =
    await prisma.$queryRaw`SELECT COUNT(SharedSolutionId) as TotalCompleted FROM (SELECT DISTINCT SharedSolutionId FROM SharedSolution JOIN Challenge ON SharedSolution.challengeId = Challenge.Id JOIN Vote ON SharedSolution.Id = Vote.SharedSolutionId WHERE SharedSolution.userId = ${userId} AND rootType = 'SHAREDSOLUTION') unique_query`;
  return data;
}

export const SharedBadgesFn = async (badges: AllBadges[], query: SharedTotals[]) => {
  const thresholds: { slug: SolutionBadges; threshold: number }[] = [
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

'use server';

import { prisma } from '@repo/db';
import type {AllBadgeObjs, BadgeFn} from "../_actions";

// eslint-disable-next-line @typescript-eslint/sort-type-constituents
export type SolutionBadges = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface SharedTotals {
  TotalCompleted: number;
}

export const sharedSolutionsBadgesFn: BadgeFn =
  async ({
           userId,
           badges,
         }: {
    userId: string;
    badges: AllBadgeObjs;
  }) => {
    // Shared Solutions Badges
    const sharedSolutions: SharedTotals[] | null = await SharedSolutionRetrieveData(userId);
    return await SharedBadgesFn(badges, sharedSolutions ?? []);
  };

export async function SharedSolutionRetrieveData(userId: string) {
  const data: SharedTotals[] | null =
    await prisma.$queryRaw`SELECT COUNT(SharedSolutionId) as TotalCompleted FROM (SELECT DISTINCT SharedSolutionId FROM SharedSolution JOIN Challenge ON SharedSolution.challengeId = Challenge.Id JOIN Vote ON SharedSolution.Id = Vote.SharedSolutionId WHERE SharedSolution.userId = ${userId} AND rootType = 'SHAREDSOLUTION') unique_query`;
  return data;
}

export const SharedBadgesFn = async (badges: AllBadgeObjs, query: SharedTotals[]) => {
  const thresholds: { slug: SolutionBadges; threshold: number }[] = [
    { slug: 'platinum', threshold: 6 },
    { slug: 'gold', threshold: 4 },
    { slug: 'silver', threshold: 2 },
    { slug: 'bronze', threshold: 0 },
  ];
  const total = query?.[0]?.TotalCompleted || 0;
  const [highestBadge] = thresholds.filter((x) => total >= x.threshold);
  if (highestBadge) {
    const badgeName = `${highestBadge.slug[0]?.toUpperCase()}${highestBadge.slug.substring(1)} Unique Solutions Badge`;
    badges = {...badges, [highestBadge.slug]: {
      slug: highestBadge.slug,
      name: `Completed ${badgeName}`,
      shortName: `Shared`,
    }};
  }
  return badges
};

import { prisma } from '@repo/db';
import type {AllBadgeObjs, BadgeFn} from "../_actions";

export const SolutionBadgeKeys = ['bronze', 'silver', 'gold', 'platinum'] as const;

export type SolutionBadges = typeof SolutionBadgeKeys[number];

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

export const SharedSolutionRetrieveData = async (userId: string) => {
  const data: SharedTotals[] | null =
    await prisma.$queryRaw`SELECT COUNT(SharedSolutionId) as TotalCompleted FROM (SELECT DISTINCT SharedSolutionId FROM SharedSolution JOIN Challenge ON SharedSolution.challengeId = Challenge.Id JOIN Vote ON SharedSolution.Id = Vote.SharedSolutionId WHERE SharedSolution.userId = ${userId} AND rootType = 'SHAREDSOLUTION') unique_query`;
  return data;
}

export const AwardSolutionBadge = (slug: SolutionBadges) => {
  const badgeName = `${slug[0]?.toUpperCase()}${slug.substring(
    1,
  )} Unique Solutions Badge`;
  return {
    [slug]: {
      slug,
      name: `Completed ${badgeName}`,
      shortName: `Shared`,
    }};
};

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
    badges = Object.assign(badges, AwardSolutionBadge(highestBadge.slug));
  }
  return badges
};

import { prisma } from '@repo/db';
import type {AllBadgeObjs, BadgeFn} from "~/app/(profile)/[username]/_components/dashboard/_actions";
import type {SolutionBadges} from "~/app/(profile)/[username]/_components/dashboard/badges/_shared_solutions_badges";
import type {AotBadges} from "~/app/(profile)/[username]/_components/dashboard/badges/_advent_badges";
export const DifficultyBadgeKeys = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'] as const;

export type DifficultyBadges = typeof DifficultyBadgeKeys[number];
export interface Difficulty {
  Difficulty: DifficultyBadges;
  TotalCompleted: number;
}

export const difficultyBadgesFn: BadgeFn =
  async ({
           userId,
           badges,
         }: {
    userId: string;
    badges: AllBadgeObjs;
  }) => {
    // DifficultyBadges
    const difficulty: Difficulty[] | null = await DifficultyRetrieveData(userId);
    return await DifficultyBadgesFn(badges, difficulty ?? []);
  };

export async function DifficultyRetrieveData(userId: string) {
  const data: Difficulty[] | null =
    await prisma.$queryRaw`SELECT Difficulty, COUNT(Id) as TotalCompleted FROM (SELECT DISTINCT Difficulty, Challenge.Id FROM Submission JOIN Challenge ON Submission.challengeId = Challenge.Id WHERE Submission.userId = ${userId} AND IsSuccessful = 1) unique_query GROUP BY Difficulty `;
  return data;
}

export const AwardDifficultyBadge = (slug: AotBadges | DifficultyBadges | SolutionBadges ): slug is DifficultyBadges => {
  const pascalCase = `${slug[0]}${slug.substring(1).toLowerCase()}`;
  return {
    [slug]: {
      slug,
      name: `Completed ${pascalCase} Difficulty Badge`,
      shortName: slug?.toLowerCase(),
    }};
}

export const DifficultyBadgesFn = async (badges: AllBadgeObjs, query: Difficulty[]) => {
  const thresholds: { difficulty: DifficultyBadges; threshold: number }[] = [
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
      badges = Object.assign(badges, AwardDifficultyBadge(currQuery?.Difficulty));
    }
  });
  return badges;
};

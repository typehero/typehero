'use server';
import { prisma } from '@repo/db';
import type {AllBadgeObjs, BadgeFn} from "~/app/(profile)/[username]/_components/dashboard/_actions";

// eslint-disable-next-line @typescript-eslint/sort-type-constituents
export type DifficultyBadges = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
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
      const pascalCase = `${currQuery.Difficulty[0]}${currQuery.Difficulty.substring(
        1,
      ).toLowerCase()}`;
      badges = { ...badges, [currQuery.Difficulty]: {
        slug: currQuery.Difficulty,
        name: `Completed ${pascalCase} Difficulty Badge`,
        shortName: currQuery.Difficulty?.toLowerCase(),
      }};
    }
  });
  return badges;
};

import { prisma } from '@repo/db';
import type {AllBadgeObjs, BadgesFn} from "~/app/(profile)/[username]/_components/dashboard/_actions";
export const difficultyBadgeKeys = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'] as const;

export type difficultyBadges = typeof difficultyBadgeKeys[number];
export interface Difficulty {
  Difficulty: difficultyBadges;
  TotalCompleted: number;
}

export const difficultyBadgesFn: BadgesFn =
  async ({
           userId,
           badges,
         }: {
    userId: string;
    badges: AllBadgeObjs;
  }) => {
    // DifficultyBadges
    const difficulty: Difficulty[] | null = await difficultyRetrieveData(userId);
    return await computeDifficultyBadge(badges, difficulty ?? []);
  };

export async function difficultyRetrieveData(userId: string) {
  const data: Difficulty[] | null =
    await prisma.$queryRaw`SELECT Difficulty, COUNT(Id) as TotalCompleted FROM (SELECT DISTINCT Difficulty, Challenge.Id FROM Submission JOIN Challenge ON Submission.challengeId = Challenge.Id WHERE Submission.userId = ${userId} AND IsSuccessful = 1) unique_query GROUP BY Difficulty `;
  return data;
}

export const awardDifficultyBadge = (slug: difficultyBadges) => {
  const pascalCase = `${slug[0]}${slug.substring(1).toLowerCase()}`;
  console.log(pascalCase)
  return {
    [slug]: {
      slug,
      name: `Completed ${pascalCase} Difficulty Badge`,
      shortName: slug?.toLowerCase(),
    }};
}


export const computeDifficultyBadge = async (badges: AllBadgeObjs, query: Difficulty[]) => {
  const thresholds: { difficulty: difficultyBadges; threshold: number }[] = [
    { difficulty: 'EASY', threshold: 13 },
    { difficulty: 'MEDIUM', threshold: 97 },
    { difficulty: 'HARD', threshold: 54 },
    { difficulty: 'EXTREME', threshold: 17 },
  ];
  query.forEach((currQuery) => {
    const levelThreshold = thresholds.find((x) => x.difficulty.toUpperCase() === currQuery.Difficulty);
    const completedAllChallenges = levelThreshold?.threshold === Number(currQuery.TotalCompleted);
    if (completedAllChallenges) {
      badges = Object.assign(badges, awardDifficultyBadge(currQuery?.Difficulty));
    }
  });
  return badges;
};

import { prisma } from '@repo/db';
import type { AllBadgeObjs, BadgesFn } from '~/app/actions/badges/_actions';

export const difficultyBadgeKeys = ['EASY', 'MEDIUM', 'HARD', 'EXTREME'] as const;

export type DifficultyBadges = (typeof difficultyBadgeKeys)[number];
export interface Difficulty {
  Difficulty: DifficultyBadges;
  TotalCompleted: number;
}

export const difficultyBadgesFn: BadgesFn = async ({
  userId,
  badges,
}: {
  userId: string;
  badges: AllBadgeObjs;
}) => {
  // DifficultyBadges
  const difficulty: Difficulty[] | null = await difficultyRetrieveData(userId);
  const challenges = await challengesRetrieveData();
  return await computeDifficultyBadge(badges, difficulty ?? [], challenges);
};

export async function difficultyRetrieveData(userId: string) {
  return await prisma.$queryRaw<
    Difficulty[]
  >`SELECT Difficulty, COUNT(Id) as TotalCompleted FROM (SELECT DISTINCT Difficulty, Challenge.Id FROM Submission JOIN Challenge ON Submission.challengeId = Challenge.Id WHERE Submission.userId = ${userId} AND IsSuccessful = 1) unique_query GROUP BY Difficulty `;
}
export async function challengesRetrieveData() {
  return prisma.challenge.groupBy({
    by: ['difficulty'],
    _count: {
      id: true,
    },
  });
}

export const awardDifficultyBadge = (slug: DifficultyBadges) => {
  const pascalCase = `${slug[0]}${slug.substring(1).toLowerCase()}`;
  console.log(pascalCase);
  return {
    [slug]: {
      slug,
      name: `Completed ${pascalCase} Difficulty Badge`,
      shortName: slug?.toLowerCase(),
    },
  };
};

export const computeDifficultyBadge = async (
  badges: AllBadgeObjs,
  query: Difficulty[],
  challenges: { _count: { id: number }; difficulty: string }[],
) => {
  const highNumberOnError = 1_000_000;
  const thresholds: { difficulty: DifficultyBadges; threshold: number }[] = [
    {
      difficulty: 'EASY',
      threshold:
        challenges.find(({ difficulty }: { difficulty: string }) => difficulty === 'EASY')?._count
          ?.id ?? highNumberOnError,
    },
    {
      difficulty: 'MEDIUM',
      threshold:
        challenges.find(({ difficulty }: { difficulty: string }) => difficulty === 'MEDIUM')?._count
          ?.id ?? highNumberOnError,
    },
    {
      difficulty: 'HARD',
      threshold:
        challenges.find(({ difficulty }: { difficulty: string }) => difficulty === 'HARD')?._count
          ?.id ?? highNumberOnError,
    },
    {
      difficulty: 'EXTREME',
      threshold:
        challenges.find(({ difficulty }: { difficulty: string }) => difficulty === 'EXTREME')
          ?._count?.id ?? highNumberOnError,
    },
  ];
  query.forEach((currQuery) => {
    const levelThreshold = thresholds.find(
      (x) => x.difficulty.toUpperCase() === currQuery.Difficulty,
    );
    const completedAllChallenges = levelThreshold?.threshold === Number(currQuery.TotalCompleted);
    if (completedAllChallenges) {
      badges = Object.assign(badges, awardDifficultyBadge(currQuery?.Difficulty));
    }
  });
  return badges;
};

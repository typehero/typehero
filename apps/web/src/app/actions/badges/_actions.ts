'use server';

import { prisma } from '@repo/db';
import type { DIFFICULTIES } from '../../(profile)/[username]/_components/dashboard/challenges-progress';
import {
  awardDifficultyBadge,
  difficultyBadgeKeys,
  type DifficultyBadges,
  difficultyBadgesFn,
} from '~/app/actions/badges/badge_types/difficulty_badges';
import {
  awardSolutionBadge,
  sharedSolutionsBadgesFn,
  solutionBadgeKeys,
  type SolutionBadges,
} from '~/app/actions/badges/badge_types/shared_solutions_badges';
import {
  adventBadgesFn,
  aotBadgeKeys,
  type AotBadges,
  awardAdventBadges,
} from '~/app/actions/badges/badge_types/advent_badges';

export type HistoricalChallenge = Awaited<ReturnType<typeof getChallengeHistoryByCategory>>[0];

type HistoryType = 'completed' | 'in-progress';
const getPredicateByType = (type: HistoryType, userId: string) => {
  switch (type) {
    case 'in-progress':
      return {
        AND: [
          {
            submission: {
              none: {
                userId,
                isSuccessful: true,
              },
            },
          },
          // Make sure there is at least one submission
          { submission: { some: { userId, isSuccessful: false } } },
        ],
      };
    case 'completed':
      return {
        submission: {
          some: {
            userId,
            isSuccessful: true,
          },
        },
      };
  }
};

export async function getChallengeHistoryByCategory(type: HistoryType, userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: getPredicateByType(type, userId),
    select: {
      id: true,
      slug: true,
      name: true,
      submission: {
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          createdAt: true,
        },
      },
    },
  });

  return challenges
    .map((challenge) => ({
      ...challenge,
      submissionDate: challenge.submission[0]?.createdAt,
    }))
    .sort(
      (challengeA, challengeB) =>
        new Date(challengeB.submissionDate!).getTime() -
        new Date(challengeA.submissionDate!).getTime(),
    );
}

export async function getSolvedChallenges(userId: string) {
  // Get all successful submissions for the user
  const successfulSubmissions = await prisma.submission.findMany({
    where: {
      userId,
      isSuccessful: true,
      challenge: {
        NOT: {
          difficulty: 'EVENT',
        },
      },
    },
    select: {
      challenge: {
        select: {
          id: true,
        },
      },
    },
    distinct: ['challengeId'],
  });

  // Get all challenges solved and group by difficulty
  const challengesSolved = await prisma.challenge.groupBy({
    by: ['difficulty'],
    where: {
      id: {
        // if the user has solved challenge, it will be in the successfulSubmissions array
        in: successfulSubmissions.map((challenge) => challenge.challenge.id),
      },
    },
    _count: {
      _all: true,
    },
  });

  const allChallenges = await prisma.challenge.groupBy({
    where: {
      NOT: {
        difficulty: 'EVENT',
      },
    },
    by: ['difficulty'],
    _count: {
      _all: true,
    },
  });

  // Calculate percentage, total solved and total challenges
  const totalSolved = challengesSolved.reduce((acc, challenge) => acc + challenge._count._all, 0);
  const totalChallenges = allChallenges.reduce((acc, challenge) => acc + challenge._count._all, 0);
  const percentage = ((totalSolved / totalChallenges) * 100).toFixed(1);

  const challenges: Record<
    (typeof DIFFICULTIES)[number],
    {
      solved: number;
      total: number;
    }
  > = {
    BEGINNER: {
      solved: 0,
      total: 0,
    },
    EASY: {
      solved: 0,
      total: 0,
    },
    MEDIUM: {
      solved: 0,
      total: 0,
    },
    HARD: {
      solved: 0,
      total: 0,
    },
    EXTREME: {
      solved: 0,
      total: 0,
    },
  };

  // assign values to the challenges object
  allChallenges.forEach((challenge) => {
    const difficulty = challenge.difficulty as (typeof DIFFICULTIES)[number];
    challenges[difficulty].total = challenge._count._all;
    challenges[difficulty].solved =
      challengesSolved.find((challenge) => challenge.difficulty === difficulty)?._count._all ?? 0;
  });

  return {
    challenges,
    totalSolved,
    totalChallenges,
    percentage,
  };
}

export interface Badges<T> {
  slug: T;
  name: string;
  shortName: string;
}

type BadgeTypes = AotBadges | DifficultyBadges | SolutionBadges;
export type BadgeObj = {
  [key in BadgeTypes]?: {
    slug: key;
    name: string;
    shortName: string;
  };
};

export type AllBadges = Badges<BadgeTypes>;
export type AllBadgeObjs = BadgeObj;

export type BadgesFn = ({ userId, badges }: { userId: string; badges: AllBadgeObjs }) => Promise<AllBadgeObjs>;

const badgeCalculations: BadgesFn[] = [
  adventBadgesFn,
  difficultyBadgesFn,
  sharedSolutionsBadgesFn,
];

export async function fillInMissingBadges(userId: string): Promise<AllBadgeObjs> {
  let badges: AllBadgeObjs = {};

  for (const badgeFn of badgeCalculations) {
    badges = await badgeFn({ userId, badges });
  }

  const userBadges =
      await prisma.userBadge.findMany({
        where: {
          userId
        },
        select: {
          badgeName: true
        }
      })
      await prisma.$queryRaw`SELECT badgeName AS slug FROM UserBadge WHERE userId=${userId}`;

  const missingBadges = Object.values(badges)
    .filter(x =>
      !userBadges
        .map(x => x.badgeName)
        .includes(x.slug));
  for (const badge of missingBadges) {
    await prisma.userBadge.create({
        data: {
            badgeName: badge.slug,
            achievementDate: new Date(Date.now()).toISOString(),
            userId
        }
      });
  }
  return badges;
}

const isBadgeWith = <T extends AotBadges | DifficultyBadges | SolutionBadges>(badge: string, keys: string[]): badge is T =>
  keys.includes(badge);
export async function getBadges(userId: string): Promise<AllBadgeObjs> {
  //TODO: should this be removed, or changed? On every call to profile is excessive
  await fillInMissingBadges(userId);
  let badges: AllBadgeObjs = {};

  // retrieve current awarded badge_types
  const userBadges =
    await prisma.userBadge.findMany({
      where: {
        userId
      },
      select: {
        badgeName: true
      }
    })
      //`SELECT badgeName AS slug FROM UserBadges WHERE userId=${userId}`;

  userBadges.forEach(({ badgeName }) => {
    if (isBadgeWith<DifficultyBadges>(badgeName, difficultyBadgeKeys as unknown as string[])) {
      badges = Object.assign(badges, awardDifficultyBadge(badgeName));
    } else if (isBadgeWith<SolutionBadges>(badgeName, solutionBadgeKeys as unknown as string[])){
      badges = Object.assign(badges, awardSolutionBadge(badgeName));
    } else if (isBadgeWith<AotBadges>(badgeName, aotBadgeKeys as unknown as string[])) {
      badges = Object.assign(badges, awardAdventBadges(badgeName));
          }
  })
  return badges;
}

'use server';

import { prisma } from '@repo/db';
import type { DIFFICULTIES } from './challenges-progress';
import {
  AwardDifficultyBadge,
  DifficultyBadgeKeys,
  type DifficultyBadges,
  DifficultyBadgesFn,
  difficultyBadgesFn
} from './badges/_difficulty_badges';
import {
  AwardSolutionBadge,
  sharedSolutionsBadgesFn, SolutionBadgeKeys,
  type SolutionBadges,
} from './badges/_shared_solutions_badges';
import {
  adventBadgesFn,
  type AdventChallenges,
  AotBadgeKeys,
  type AotBadges,
  CreateAdventBadges
} from './badges/_advent_badges';
import {DifficultyBadge} from "@repo/ui/src/components/difficulty-badge";

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
export type BadgeObj<T> = {
  [key in BadgeTypes]?: {
    slug: key;
    name: string;
    shortName: string;
  };
};

export type AllBadges = Badges<BadgeTypes>;
export type AllBadgeObjs = BadgeObj<BadgeTypes>;

export type BadgeFn = ({ userId, badges }: { userId: string; badges: AllBadgeObjs }) => Promise<AllBadgeObjs>;

const badgeCalculations: BadgeFn[] = [
  adventBadgesFn,
  difficultyBadgesFn,
  sharedSolutionsBadgesFn,
];

// TODO: where does this actually go? on submissions?
export async function fillInMissingBadges(userId: string): Promise<AllBadgeObjs> {
  let badges: AllBadgeObjs = {};

  // calculate badges user has achieved
  for (const badgeFn of badgeCalculations) {
    badges = await badgeFn({ userId, badges });
  }

  // retrieve current awarded badges
  const userBadges: { slug: string; }[] = await prisma.$queryRaw`SELECT badge_name AS slug FROM UserBadges WHERE user_id=${userId}`;

  // award missing badges
  const missingBadges = Object.values(badges)
    .filter(x =>
      !userBadges
        .map(x => x.slug)
        .includes(x.slug));
  for (const badge of missingBadges) {
    await prisma.$queryRaw`INSERT INTO UserBadges(badge_name, achievement_date, user_id) VALUES(${badge.slug}, ${new Date(Date.now()).toISOString().slice(0, 10).replace('T', ' ')}, ${userId})`;
  }

  return badges;
}

const mapBadgeToFn = {
  [DifficultyBadgeKeys[0]]: (badge: DifficultyBadges) => AwardDifficultyBadge(badge),
  [DifficultyBadgeKeys[1]]: (badge: DifficultyBadges) => AwardDifficultyBadge(badge),
  [DifficultyBadgeKeys[2]]: (badge: DifficultyBadges) => AwardDifficultyBadge(badge),
  [DifficultyBadgeKeys[3]]: (badge: DifficultyBadges) => AwardDifficultyBadge(badge),
  [DifficultyBadgeKeys[4]]: (badge: DifficultyBadges) => AwardDifficultyBadge(badge),
  [SolutionBadgeKeys[0]]: (badge: SolutionBadges) => AwardSolutionBadge(badge),
  [SolutionBadgeKeys[1]]: (badge: SolutionBadges) => AwardSolutionBadge(badge),
  [SolutionBadgeKeys[2]]: (badge: SolutionBadges) => AwardSolutionBadge(badge),
  [SolutionBadgeKeys[3]]: (badge: SolutionBadges) => AwardSolutionBadge(badge),
  [AotBadgeKeys[0]]: (badge: AotBadges) =>
    CreateAdventBadges(badge, `Advent of Typescript 2023 Bronze`),
  [AotBadgeKeys[1]]: (badge: AotBadges) =>
    CreateAdventBadges(badge, `Advent of Typescript 2023 Silver`),
  [AotBadgeKeys[2]]: (badge: AotBadges) =>
    CreateAdventBadges(badge, `Advent of Typescript 2023 Gold`),
  [AotBadgeKeys[3]]: (badge: AotBadges) =>
    CreateAdventBadges(badge, `Advent of Typescript 2023 Platinum`),
};
export async function getBadges(userId: string): Promise<AllBadgeObjs> {
  let badges: AllBadgeObjs = {};

  // retrieve current awarded badges
  const userBadges: { slug: AotBadges | DifficultyBadges | SolutionBadges; }[] =
    await prisma.$queryRaw`SELECT badge_name AS slug FROM UserBadges WHERE user_id=${userId}`;

  userBadges.forEach(({slug}: { slug: AotBadges | DifficultyBadges | SolutionBadges }) => {
    const addBadge = mapBadgeToFn[slug as DifficultyBadges](slug as DifficultyBadges);
    badges = Object.assign(badges, addBadge);
  })

  return badges;
}

'use server';

import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';
import type { DIFFICULTIES } from './challenges-progress';

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

export async function getSolvedChallenges() {
  const session = await getServerAuthSession();

  const successfulSubmissions = await prisma.submission.findMany({
    where: {
      userId: session?.user.id,
      isSuccessful: true,
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

  const challengesSolved = await prisma.challenge.groupBy({
    by: ['difficulty'],
    where: {
      id: {
        in: successfulSubmissions.map((challenge) => challenge.challenge.id),
      },
    },
    _count: {
      _all: true,
    },
  });

  const allChallenges = await prisma.challenge.groupBy({
    by: ['difficulty'],
    _count: {
      _all: true,
    },
  });

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

  // assign values
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

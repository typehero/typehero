'use server';

import { prisma } from '@repo/db';

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

export interface BadgeInfo {
  // eslint-disable-next-line @typescript-eslint/sort-type-constituents
  slug: 'aot-2024-bronze' | 'aot-2024-silver' | 'aot-2024-gold' | 'aot-2024-platinum';
  name: string;
}

export async function getBadges(userId: string): Promise<BadgeInfo[]> {
  const badges: BadgeInfo[] = [];

  const holidayTrack = await prisma.track.findFirst({
    where: {
      slug: 'advent-of-typescript-2024',
    },
    include: {
      trackChallenges: {
        orderBy: {
          orderId: 'asc',
        },
        include: {
          challenge: {
            include: {
              submission: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
      enrolledUsers: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const numberOfAttemptedHolidayChallenges =
    holidayTrack?.trackChallenges.filter((trackChallenge) => {
      return (trackChallenge.challenge.submission?.length ?? 0) > 0;
    }).length ?? 0;

  if (numberOfAttemptedHolidayChallenges > 0) {
    badges.push({ slug: 'aot-2024-bronze', name: 'Advent of TypeScript 2024 Bronze' });
  }

  const numberOfCompletedHolidayChallenges =
    holidayTrack?.trackChallenges.filter((trackChallenge) => {
      return trackChallenge.challenge.submission?.some((submission) => submission.isSuccessful);
    }).length ?? 0;

  if (numberOfCompletedHolidayChallenges >= 5) {
    badges.push({ slug: 'aot-2024-silver', name: 'Advent of TypeScript 2024 Silver' });
  }

  if (numberOfCompletedHolidayChallenges >= 15) {
    badges.push({ slug: 'aot-2024-gold', name: 'Advent of TypeScript 2024 Gold' });
  }

  if (numberOfCompletedHolidayChallenges >= 25) {
    badges.push({ slug: 'aot-2024-platinum', name: 'Advent of TypeScript 2024 Platinum' });
  }

  return badges;
}

import { prisma } from '@repo/db';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { getAotChallengeIdForAdventDay } from '../getAotChallengeIds';

export const getFirst100SubmissionsRanked = async (adventYear: string, adventDay: string) => {
  // We already checked adventDay is valid in day/[day]/layout.tsx
  const challengeId = await getAotChallengeIdForAdventDay(adventYear, adventDay)!;
  const submissions = await prisma.submission.findMany({
    select: {
      id: true,
      createdAt: true,
      user: { select: { name: true, image: true, roles: true, bio: true } },
    },
    where: {
      challengeId,
      isSuccessful: true,
      user: {
        status: 'ACTIVE',
      },
    },
    distinct: ['userId'],
    orderBy: {
      createdAt: 'asc',
    },
    take: LEADERBOARD_RANKING_LIMIT,
  });
  const submissionsWithFlatUsers = submissions.map((s) => ({
    //Named score since this shape of this type is being shared with getOverallLeaderboard
    score: formatDate(s.createdAt),
    ...s.user,
  }));
  return submissionsWithFlatUsers;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(date));
};

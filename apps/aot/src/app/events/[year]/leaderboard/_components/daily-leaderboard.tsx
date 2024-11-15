import { prisma } from '@repo/db';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { getAotChallengeIdForAdventDay } from '../getAotChallengeIds';
import { differenceInMilliseconds, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export const getFirst100SubmissionsRanked = async (adventYear: string, adventDay: string) => {
  // We already checked adventDay is valid in day/[day]/layout.tsx
  const challengeId = await getAotChallengeIdForAdventDay(adventYear, adventDay)!;
  const submissions = await prisma.submission.findMany({
    select: { id: true, createdAt: true, user: { select: { name: true, image: true } } },
    where: {
      challengeId,
      isSuccessful: true,
    },
    distinct: ['userId'],
    orderBy: {
      createdAt: 'asc',
    },
    take: LEADERBOARD_RANKING_LIMIT,
  });
  const submissionsWithFlatUsers = submissions.map((s) => ({
    //Named score since this shape of this type is being shared with getOverallLeaderboard
    score: calculateDuration({ year: adventYear, day: adventDay }, s.createdAt),
    //todo
    isSupporter: Math.random() > 0.8,
    ...s.user,
  }));
  return submissionsWithFlatUsers;
};

const calculateDuration = (start: { year: string; day: string }, end: Date) => {
  const duration = differenceInMilliseconds(
    end,
    new Date(Number(start.year), 11, Number(start.day)),
  );
  const date = format(duration, 'HH:MM:SS');
  return date;
};

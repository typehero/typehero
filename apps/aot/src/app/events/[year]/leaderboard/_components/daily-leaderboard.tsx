import { prisma } from '@repo/db';
import { LEADERBOARD_RANKING_LIMIT } from '../constants';
import { getAotChallengeIdForAdventDay } from '../getAotChallengeIds';
import { differenceInMilliseconds } from 'date-fns';
import { TZDate } from '@date-fns/tz';

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
    score: calculateDuration({ year: adventYear, day: adventDay }, s.createdAt),
    ...s.user,
  }));
  return submissionsWithFlatUsers;
};

const calculateDuration = (start: { year: string; day: string }, end: Date) => {
  //Create a new day at midnight, at EST
  const startDate = TZDate.tz('America/New_York', Number(start.year), 11, Number(start.day));
  //Let TZDate know this date is in EST
  const endDate = new TZDate(end, 'America/New_York');

  const duration = differenceInMilliseconds(endDate, startDate);
  const formattedDuration = msToTime(duration);
  return formattedDuration;
};

function msToTime(duration: number) {
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

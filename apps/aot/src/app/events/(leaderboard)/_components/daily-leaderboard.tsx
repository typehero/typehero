import { prisma } from '@repo/db';
import { LEADERBOARD_RANKING_LIMIT } from './constants';
import { getAotChallengeIdForAdventDay } from './getAotChallengeIds';

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

  const releaseDate = new Date(Date.UTC(Number(adventYear), 11, Number(adventDay), 5, 0, 0));
  const submissionsWithFlatUsers = submissions.map((s) => ({
    //Named score since this shape of this type is being shared with getOverallLeaderboard
    score: formatTimeSinceRelease(s.createdAt, releaseDate),
    ...s.user,
  }));

  return submissionsWithFlatUsers;
};

const padTimeComponent = (value: number): string => String(value).padStart(2, '0');
function formatTimeSinceRelease(submissionDate: Date, releaseDate: Date) {
  const diffInMilliseconds = submissionDate.getTime() - releaseDate.getTime();

  const totalSeconds = Math.floor(diffInMilliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${padTimeComponent(hours)}:${padTimeComponent(minutes)}:${padTimeComponent(seconds)}`;
}

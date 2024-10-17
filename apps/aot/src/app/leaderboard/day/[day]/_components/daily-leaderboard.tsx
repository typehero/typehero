import { prisma } from '@repo/db';
import { ADVENT_CHALLENGE_IDS, LEADERBOARD_RANKING_LIMIT } from '~/app/leaderboard/constants';

const getFirst100SubmissionsRanked = async (adventDay: number) => {
  const challengeId = ADVENT_CHALLENGE_IDS[adventDay - 1];
  const submissions = await prisma.submission.findMany({
    where: {
      challengeId,
      isSuccessful: true,
    },
    distinct: ['userId'],
    orderBy: {
      createdAt: 'asc',
    },
    take: LEADERBOARD_RANKING_LIMIT,
    include: {
      user: true,
    },
  });
  return submissions;
};

export default async function DailyLeaderboard({ adventDay }: { adventDay: number }) {
  const first100SubmissionsRanked = await getFirst100SubmissionsRanked(adventDay);

  return (
    <div className="p-4">
      <ul className="flex flex-col gap-2 font-mono">
        {first100SubmissionsRanked.map((submission, index) => (
          <li key={submission.id} className="flex gap-10 border p-4">
            <p>{index + 1})</p>
            <p>{formatDate(submission.createdAt)}</p>
            <p>{submission.user.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/*
    Utilities - will move later
*/
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(date));
};

import { prisma } from '@repo/db';
import type { Submission, User } from '@repo/db/types';
import { type AdventDay } from '~/utils/time-utils';

async function takeSnapshot(adventDay: number) {
  const challengeId = FAKE_DAILY_CHALLENGE_IDS[adventDay - 1];
  const topSubmissions = await prisma.submission.findMany({
    where: { challengeId, isSuccessful: true },
    orderBy: { createdAt: 'asc' },
    take: 100,
    include: { user: true },
  });

  // TODO / UNDECIDED:
  // What method do we want to go with for saving the top submissions once we have the first 100?
  //
  // Easy solution is to run this function and save results in a snapshots.ts file
  // Then we can retrieve from snapshot if exists or getFirst100SubmissionsRanked if not
  // Requires us to manually run this or set up some automatic job
}

// Just temporary to display my thinking
type SubmissionWithUser = Submission & { user: User };
const SNAPSHOTS: SubmissionWithUser[][] = []; // pretend this is an array of snapshots from snapshots.ts
const getSnapshot = (adventDay: AdventDay) => SNAPSHOTS[adventDay - 1];

const getFirst100SubmissionsRanked = async (adventDay: AdventDay) => {
  const challengeId = FAKE_DAILY_CHALLENGE_IDS[adventDay - 1];
  const submissions = await prisma.submission.findMany({
    where: {
      challengeId,
      isSuccessful: true,
    },
    distinct: ['userId'],
    orderBy: {
      createdAt: 'asc',
    },
    take: 100,
    include: {
      user: true,
    },
  });
  return submissions;
};

export default async function DailyLeaderboard({ adventDay }: { adventDay: AdventDay }) {
  const snapshot = getSnapshot(adventDay);
  const first100SubmissionsRanked = snapshot ?? (await getFirst100SubmissionsRanked(adventDay));

  return (
    <div>
      <ul className="flex flex-col gap-2 p-4 font-mono">
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

// Id of each challenge in order
// We can then lookup day x's challenge by doing FAKE_DAILY_CHALLENGE_IDS[day-1]
const FAKE_DAILY_CHALLENGE_IDS = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 43, 55, 57, 59, 62, 89, 90,
] as const;

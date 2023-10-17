import { prisma } from '@repo/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import Link from 'next/link';
import { getRelativeTime } from '~/utils/relativeTime';
import { withUnstableCache } from '~/utils/withUnstableCache';

export async function InProgressTab({ userId }: { userId: string }) {
  const challenges = await withUnstableCache({
    fn: getInProgressChallenges,
    args: [userId],
    keys: ['in-progress-challenges'],
    tags: ['challenges'],
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Challenge</TableHead>
          <TableHead>Last Submission</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {challenges.map((challenge) => (
          <TableRow key={challenge.id}>
            <TableCell className="font-medium underline">
              <Link href={`/challenge/${challenge.id}`}>{challenge.name}</Link>
            </TableCell>
            <TableCell>{getRelativeTime(challenge.submission[0]!.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function getInProgressChallenges(userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: {
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
    },
    select: {
      id: true,
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

  return challenges.sort(
    (challengeA, challengeB) =>
      new Date(challengeB.submission[0]!.createdAt).getTime() -
      new Date(challengeA.submission[0]!.createdAt).getTime(),
  );
}

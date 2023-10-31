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
import { createCompletedSubmissionCacheKey } from '~/app/[locale]/challenge/[slug]/submissions/[[...catchAll]]/save-submission.action';
import { getRelativeTime } from '~/utils/relativeTime';
import { withUnstableCache } from '~/utils/withUnstableCache';

export async function CompletedTab({ userId }: { userId: string }) {
  const challenges = await withUnstableCache({
    fn: getCompletedChallenges,
    args: [userId],
    keys: [`completed-challenges`],
    tags: [createCompletedSubmissionCacheKey(userId)],
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
              <Link href={`/challenge/${challenge.slug}`}>{challenge.name}</Link>
            </TableCell>
            <TableCell>{getRelativeTime(challenge.submission[0]!.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function getCompletedChallenges(userId: string) {
  const challenges = await prisma.challenge.findMany({
    where: {
      submission: {
        some: {
          userId,
          isSuccessful: true,
        },
      },
    },
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

  return challenges.sort(
    (challengeA, challengeB) =>
      new Date(challengeB.submission[0]!.createdAt).getTime() -
      new Date(challengeA.submission[0]!.createdAt).getTime(),
  );
}

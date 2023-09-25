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
  const submissions = await withUnstableCache({
    fn: getInProgressSubmissions,
    args: [userId],
    tags: ['in-progress'],
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
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium underline">
              <Link href={`/challenge/${submission.challenge.id}`}>
                {submission.challenge.name}
              </Link>
            </TableCell>
            <TableCell>{getRelativeTime(submission.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function getInProgressSubmissions(id: string) {
  return await prisma.submission.findMany({
    where: {
      userId: id,
      isSuccessful: false,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    take: 25,
    include: {
      challenge: true,
    },
    distinct: 'challengeId',
  });
}

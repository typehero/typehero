import { prisma } from '@repo/db';
import { Badge } from '@repo/ui/components/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import Link from 'next/link';
import { withUnstableCache } from '~/utils/withUnstableCache';

export async function SubmissionsTab({ userId }: { userId: string }) {
  const submissions = await withUnstableCache({
    fn: getRecentSubmissions,
    args: [userId],
    keys: ['all-submissions'],
    tags: ['submissions'],
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Challenge</TableHead>
          <TableHead>Status</TableHead>
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
            <TableCell>
              {submission.isSuccessful ? (
                <Badge className="dark:bg-difficulty-easy-dark bg-difficulty-easy text-white duration-300 dark:text-black">
                  Accepted
                </Badge>
              ) : (
                <Badge className="dark:bg-difficulty-hard-dark bg-difficulty-hard text-white duration-300 dark:text-black">
                  Rejected
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function getRecentSubmissions(id: string) {
  return await prisma.submission.findMany({
    where: {
      userId: id,
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
  });
}

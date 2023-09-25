import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { Badge } from '@repo/ui/components/badge';
import { cache } from 'react';
import { prisma } from '@repo/db';

const getRecentSubmissions = cache(async (id: string) => {
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
});

export async function SubmissionsTab({ userId }: { userId: string }) {
  const submissions = await getRecentSubmissions(userId);

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

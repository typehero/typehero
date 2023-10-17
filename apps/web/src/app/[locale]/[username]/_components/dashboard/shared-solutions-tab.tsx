import Link from 'next/link';

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

import { getRelativeTime } from '~/utils/relativeTime';
import { withUnstableCache } from '~/utils/withUnstableCache';

export async function SharedSolutionsTab({ userId }: { userId: string }) {
  const solutions = await withUnstableCache({
    fn: getSharedSolutions,
    args: [userId],
    keys: ['shared-solutions'],
    tags: ['submissions'],
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shared Solution</TableHead>
          <TableHead>Votes</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {solutions.map((solution) => (
          <TableRow key={solution.id}>
            <TableCell className="font-medium underline">
              <Link href={`/challenge/${solution.challenge?.slug}`}>
                {solution.challenge?.name}
              </Link>
            </TableCell>
            <TableCell>{solution._count.vote}</TableCell>
            <TableCell className="font-medium underline">
              {Boolean(solution.createdAt) && getRelativeTime(solution.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function getSharedSolutions(userId: string) {
  return await prisma.sharedSolution.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          vote: true,
        },
      },
      challenge: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  });
}

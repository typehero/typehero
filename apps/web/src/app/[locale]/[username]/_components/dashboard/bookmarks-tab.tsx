import Link from 'next/link';

import { prisma } from '@repo/db';
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

export async function BookmarksTab({ userId }: { userId: string }) {
  const bookmarks = await withUnstableCache({
    fn: getBookmarkedChallenges,
    args: [userId],
    keys: ['bookmarked-challenges'],
    tags: ['challenges'],
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Challenge</TableHead>
          <TableHead>Bookmarked</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookmarks.map((bookmark) => (
          <TableRow key={bookmark.id}>
            <TableCell className="font-medium underline">
              {Boolean(bookmark.challenge) && (
                <Link href={`/challenge/${bookmark.challenge?.slug}`}>
                  {bookmark.challenge?.name}
                </Link>
              )}
            </TableCell>
            <TableCell>
              {Boolean(bookmark.createdAt) && getRelativeTime(bookmark.createdAt!)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

async function getBookmarkedChallenges(userId: string) {
  return await prisma.bookmark.findMany({
    where: { userId },
    include: {
      challenge: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

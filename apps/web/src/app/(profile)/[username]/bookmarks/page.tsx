import { prisma } from '@repo/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { notFound } from 'next/navigation';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { createCacheKeyForBookmarksTab } from '../../../challenge/_components/bookmark.action';
import { DataTable } from '@repo/ui/components/data-table';
import { bookmarkedChallengedColumns } from './_components/bookmarked-challenges-columns';
import { auth } from '@repo/auth/server';

interface Props {
  params: {
    username: string;
  };
}

export default async function BookmarksPage({ params: { username: usernameFromQuery } }: Props) {
  const session = await auth();
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username || session?.user?.name !== username) return notFound();

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
    select: {
      id: true,
    },
  });

  if (!user) return notFound();

  const bookmarks = await withUnstableCache({
    fn: getBookmarkedChallenges,
    args: [user.id],
    keys: [`bookmarked-challenges`],
    tags: [createCacheKeyForBookmarksTab(user.id)],
  });

  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>Bookmarks</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          Your bookmarked challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable data={bookmarks} columns={bookmarkedChallengedColumns} />
      </CardContent>
    </Card>
  );
}

export type BookmarkedChallenge = Awaited<ReturnType<typeof getBookmarkedChallenges>>[0];
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

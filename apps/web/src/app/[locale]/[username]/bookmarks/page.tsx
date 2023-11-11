import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { prisma } from '@repo/db';
import { BookmarksTab } from '../_components/dashboard/bookmarks-tab';
import { notFound } from 'next/navigation';
import { getServerAuthSession } from '@repo/auth/server';

interface Props {
  params: {
    username: string;
  };
}

export default async function BookmarksPage({ params: { username: usernameFromQuery } }: Props) {
  const session = await getServerAuthSession();
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username || session?.user.name !== username) return notFound();

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
    select: {
      id: true,
      createdAt: true,
      bio: true,
      image: true,
      name: true,
      userLinks: true,
    },
  });

  if (!user) return notFound();

  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>Bookmarks</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          Your bookmarked challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BookmarksTab userId={user.id} />
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { SharedSolutionsTab } from '../_components/dashboard/shared-solutions-tab';
import { notFound } from 'next/navigation';
import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';

interface Props {
  params: {
    username: string;
  };
}

export default async function SharedSolutionsPage({
  params: { username: usernameFromQuery },
}: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username) return notFound();

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

  const session = await getServerAuthSession();
  const isOwnProfile = session?.user.id === user.id;

  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>Shared Solutions</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          {isOwnProfile ? 'Your' : `${user.name}'s`} shared challenge solutions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SharedSolutionsTab userId={user.id} />
      </CardContent>
    </Card>
  );
}

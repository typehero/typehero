import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { InProgressTab } from '../_components/dashboard/in-progress-tab';
import { notFound } from 'next/navigation';
import { prisma } from '@repo/db';

interface Props {
  params: {
    username: string;
  };
}

export default async function InProgressPage({ params: { username: usernameFromQuery } }: Props) {
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

  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>In-Progress</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          Your in-progress challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InProgressTab userId={user.id} />
      </CardContent>
    </Card>
  );
}

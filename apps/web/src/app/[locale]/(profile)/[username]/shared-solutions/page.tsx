import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { DataTable } from '@repo/ui/components/data-table';
import { notFound } from 'next/navigation';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { createCacheKeyForSharedSolutionsTab } from '../../../challenge/[slug]/solutions/_components/_actions';
import { sharedSolutionsColumns } from './_components/shared-solutions-columns';

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
      name: true,
    },
  });

  if (!user) return notFound();

  const solutions = await withUnstableCache({
    fn: getSharedSolutions,
    args: [user.id],
    keys: [`shared-solutions`],
    tags: [createCacheKeyForSharedSolutionsTab(user.id)],
  });

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
        <DataTable data={solutions} columns={sharedSolutionsColumns} />
      </CardContent>
    </Card>
  );
}

export type SharedSolutions = Awaited<ReturnType<typeof getSharedSolutions>>;
export type SharedSolution = SharedSolutions[0];
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

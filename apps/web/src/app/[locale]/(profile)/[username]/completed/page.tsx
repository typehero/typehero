import { prisma } from '@repo/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { notFound } from 'next/navigation';
import { createCompletedSubmissionCacheKey } from '~/app/[locale]/challenge/[slug]/submissions/[[...catchAll]]/cache-keys';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { getChallengeHistoryByCategory } from '../_components/dashboard/_actions';
import ChallengeHistory from '../_components/dashboard/challenge-history';
import { auth } from '@repo/auth/server';

interface Props {
  params: {
    username: string;
  };
}

export default async function CompletedPage({ params: { username: usernameFromQuery } }: Props) {
  const session = await auth();
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
    },
  });

  if (!user) return notFound();

  const challenges = await withUnstableCache({
    fn: getChallengeHistoryByCategory,
    args: ['completed', user.id],
    keys: [`completed-challenges-${user.id}`],
    tags: [createCompletedSubmissionCacheKey(user.id)],
  });

  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>Completed</CardTitle>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          Your completed challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChallengeHistory challenges={challenges} />
      </CardContent>
    </Card>
  );
}

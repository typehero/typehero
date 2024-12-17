import { prisma } from '@repo/db';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '~/server/auth';
import { Challenges } from './_components/challenges';

export default async function CompletedPage(props: { params: { username: string } }) {
  const [, username] = decodeURIComponent(props.params.username).split('@');
  if (username === undefined) {
    notFound();
  }
  const challenges = await prisma.challenge.findMany({
    select: {
      difficulty: true,
      id: true,
      name: true,
      slug: true,
      //The submission part below is run as a separate query, this ensures that the most recently successfull submission of the current user is selected
      submission: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          isSuccessful: true,
          user: {
            name: username,
          },
        },
      },
      updatedAt: true,
      shortDescription: true,
      user: {
        select: { name: true },
      },
      _count: {
        select: {
          vote: true,
          comment: true,
        },
      },
    },
    where: {
      submission: {
        some: {
          isSuccessful: true,
          user: {
            name: username,
          },
        },
      },
      difficulty: {
        not: 'EVENT',
      },
    },
  });
  const session = await auth();
  const isOwnProfile = username === session?.user.name;

  return (
    <div className="mt-8 lg:mt-10">
      <h1 className="text-muted-foreground text-center text-xl">Completed Challenges</h1>
      {challenges.length > 0 ? (
        <Challenges
          challenges={challenges}
          isOwnProfile={isOwnProfile}
          username={username}
          className="mt-2"
        />
      ) : (
        <Alert className="mx-auto mt-4 w-fit md:px-8">
          <AlertTitle className="text-center leading-normal">
            <span>{isOwnProfile ? "You haven't" : `@${username} hasn't`}</span> completed any{' '}
            challenges yet
          </AlertTitle>
          {isOwnProfile ? (
            <AlertDescription className="flex justify-center">
              <Link className="text-primary underline-offset-4 hover:underline" href="/explore">
                Get started with your first challenge
              </Link>
            </AlertDescription>
          ) : null}
        </Alert>
      )}
    </div>
  );
}

import { prisma } from '@repo/db';
import { Button } from '@repo/ui/components/button';
import { ArrowLeft } from '@repo/ui/icons';
import Link from 'next/link';
import { Challenges } from './_components/challenges';
import { notFound } from 'next/navigation';

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
      submission: true,
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
    },
  });

  return (
    <div className="lg:mt10 relative  mt-8">
      <div className="space-y-2">
        <h1 className="text-center text-xl">Completed Challenges</h1>
        <Challenges challenges={challenges} />
      </div>
    </div>
  );
}

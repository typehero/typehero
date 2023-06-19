import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import { DescriptionPanel } from './description-panel';
import { CodePanel } from './editor';
import { getServerSession } from 'next-auth';

interface Props {
  id: string;
}
export async function Challenge({ id }: Props) {
  const session = await getServerSession();
  // query a challenge by id
  // include the count of votes
  // include if I voted for this challenge
  const challenge = await prisma.challenge.findFirst({
    where: { id: +id },
    include: {
      _count: {
        select: { Vote: true },
      },
      Vote: {
        where: {
          userId: session?.user.id,
          challengeId: +id,
        },
      },
    },
  });

  if (!challenge) {
    notFound();
  }

  return (
    <div className="flex h-full gap-2 p-4">
      <DescriptionPanel challenge={challenge} />

      <div className="flex h-full flex-1 flex-col">
        <CodePanel prompt={challenge.prompt} />
      </div>
    </div>
  );
}

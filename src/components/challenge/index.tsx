import { type Session, getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';

import { InnerIndex } from './innerIndex';

interface Props {
  id: string;
}

export type Challenge = Awaited<ReturnType<typeof getChallenge>>;
export async function Challenge({ id }: Props) {
  const session = await getServerSession();
  const challenge = await getChallenge(id, session);

  if (!challenge || typeof challenge.prompt !== 'string') {
    return notFound();
  }

  return <InnerIndex challenge={challenge} />;
}

async function getChallenge(id: string, session: Session | null) {
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
      Bookmark: {
        where: {
          userId: session?.user.id,
          challengeId: +id,
        },
      },
      Solution: {
        where: {
          userId: session?.user.id,
          challengeId: +id,
        },
      },
      SharedSolution: {
        where: {
          challengeId: +id,
        },
      },
    },
  });

  return challenge;
}

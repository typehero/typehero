import { type Session, getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';
import { DescriptionPanel } from './description-panel';
import { CodePanel } from './editor';

interface Props {
  id: string;
}

export type Challenge = Awaited<ReturnType<typeof getChallenge>>;
export async function Challenge({ id }: Props) {
  const session = await getServerSession();
  const challenge = await getChallenge(id, session);
  if (!challenge || typeof challenge.prompt !== 'string') {
    notFound();
  }

  return (
    <div
      className="flex flex-col gap-2 px-4 pb-4 lg:flex-row 2xl:grid 2xl:grid-cols-3"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <DescriptionPanel challenge={challenge} />

      <CodePanel challenge={challenge} />
    </div>
  );
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

import { getServerSession, type Session } from 'next-auth';
import { notFound } from 'next/navigation';
import { prisma } from '~/server/db';

import { ChallengeLayout } from './challenge-layout';
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
    return notFound();
  }

  return (
    <ChallengeLayout
      left={<DescriptionPanel challenge={challenge} />}
      right={<CodePanel mode="solve" challenge={challenge} />}
    />
  );
}

async function getChallenge(id: string, session: Session | null) {
  const challenge = await prisma.challenge.findFirst({
    where: { id: +id },
    include: {
      _count: {
        select: { vote: true },
      },
      vote: {
        where: {
          userId: session?.user.id,
        },
      },
      bookmark: {
        where: {
          userId: session?.user.id,
        },
      },
      solution: {
        where: {
          userId: session?.user.id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        take: 10,
      },
      sharedSolution: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        take: 5,
        include: {
          user: true,
          _count: {
            select: { vote: true, solutionComment: true },
          },
        },
      },
    },
  });

  return challenge;
}

'use server'
import { type Session, getServerSession } from 'next-auth';
import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { CodePanel } from '~/components/challenge/editor';
import { prisma } from '~/server/db';

export async function LayoutData({
  children,
  challengeId,
}: {
  children: React.ReactNode;
  challengeId: string;
}) {
  const session = await getServerSession();
  const challenge = await getChallenge(challengeId, session);
  if (!challenge) return <div>loading</div>;
  // if on submissions/{id} feed the overlay as right panel
  // else use editor
  return (
    <ChallengeLayout left={children} right={<CodePanel mode="solve" challenge={challenge} />} />
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
      comment: {
        take: 10,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: true,
        },
      },
    },
  });

  return challenge;
}

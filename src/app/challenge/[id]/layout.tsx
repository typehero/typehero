import { getServerSession, type Session } from 'next-auth';
import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { prisma } from '~/server/db';
import { Wrapper } from './wrapper';

export type Challenge = Awaited<ReturnType<typeof getChallenge>>;
export default async function LayoutData({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await getServerSession();
  const challenge = await getChallenge(id, session);
  if (!challenge) return <div>loading</div>;
  return <ChallengeLayout left={children} right={<Wrapper challenge={challenge} />} />;
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

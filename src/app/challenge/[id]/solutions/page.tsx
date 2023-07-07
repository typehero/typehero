import { getServerSession, type Session } from 'next-auth';
import { notFound } from 'next/navigation';
import { LeftPanel } from '~/components/challenge/left-panel';
import { prisma } from '~/server/db';

interface Props {
  params: {
    id: string;
  };
}

export type Challenge = Awaited<ReturnType<typeof getChallenge>>;

export default async function SolutionPage({ params: { id } }: Props) {
  const session = await getServerSession();
  const challenge = await getChallenge(id, session);

  if (!challenge || typeof challenge.prompt !== 'string') {
    return notFound();
  }

  return <LeftPanel challenge={challenge} selectedTab={'solutions'} />;
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

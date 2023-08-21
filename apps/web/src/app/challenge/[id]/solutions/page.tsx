import type { Session } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { Solutions } from './_components';

interface Props {
  params: {
    id: string;
  };
}

export default async function SolutionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const solutions = await getSolutionsData(id, session);

  if (!solutions) {
    return notFound();
  }

  return <Solutions challenge={solutions} />;
}

export type ChallengeSolutionsRouteData = NonNullable<Awaited<ReturnType<typeof getSolutionsData>>>;
export async function getSolutionsData(challengeId: string, session: Session | null) {
  const data = await prisma.challenge.findFirst({
    where: { id: Number(challengeId) },
    select: {
      id: true,
      // we just want their most recent solution
      submission: {
        where: {
          userId: session?.user.id || '',
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        take: 1,
      },
      sharedSolution: {
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          user: true,
          _count: {
            select: { vote: true, solutionComment: true },
          },
        },
      },
    },
  });

  return data;
}

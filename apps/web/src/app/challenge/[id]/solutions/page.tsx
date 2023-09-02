import type { Session } from '@repo/auth/server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import { Solutions } from './_components';
import { getChallengeRouteData } from '../getChallengeRouteData';
import { buildMetaForChallenge } from '~/app/metadata';

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params: { id } }: Props) {
  const challenge = await getChallengeRouteData(id, null);
  return buildMetaForChallenge({
    title: `Solutions to ${challenge.name} | TypeHero`,
    description: challenge.shortDescription,
    username: challenge.user.name,
  });
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
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: { vote: true, solutionComment: true },
          },
        },
      },
    },
  });

  return data;
}

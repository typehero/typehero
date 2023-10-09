import { cache } from 'react';
import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { Submissions } from './_components';
import { withUnstableCache } from '~/utils/withUnstableCache';

interface Props {
  params: {
    id: string;
  };
}

export const metadata = {
  title: 'Submissions | TypeHero',
  description: 'View your submissions to this challenge on TypeHero.',
};

export default async function SubmissionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await withUnstableCache({
    fn: getChallengeSubmissions,
    args: [session?.user.id ?? '', id],
    keys: ['all-challenge-submissions'],
    tags: [`${id}-challenge-submissions`],
  });

  if (!submissions) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}

export type ChallengeSubmissions = NonNullable<Awaited<ReturnType<typeof getChallengeSubmissions>>>;
export const getChallengeSubmissions = cache((userId: string, challengeId: string) => {
  return prisma.submission.findMany({
    where: { challengeId: Number(challengeId), userId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
});

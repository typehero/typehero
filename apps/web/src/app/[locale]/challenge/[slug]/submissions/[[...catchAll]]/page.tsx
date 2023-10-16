import { cache } from 'react';
import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';
import { notFound, redirect } from 'next/navigation';
import { Submissions } from './_components';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { isBetaUser } from '~/utils/server/is-beta-user';
import { createChallengeSubmissionCacheKey } from './save-submission.action';

interface Props {
  params: {
    slug: string;
  };
}

export const metadata = {
  title: 'Submissions | TypeHero',
  description: 'View your submissions to this challenge on TypeHero.',
};

export default async function SubmissionPage({ params: { slug } }: Props) {
  const session = await getServerAuthSession();
  const isBeta = await isBetaUser(session);

  if (!isBeta) {
    return redirect('/claim');
  }

  const submissions = await withUnstableCache({
    fn: getChallengeSubmissions,
    args: [session?.user.id ?? '', slug],
    keys: ['all-challenge-submissions'],
    tags: [createChallengeSubmissionCacheKey(slug)],
  });

  if (!submissions) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}

export type ChallengeSubmissions = NonNullable<Awaited<ReturnType<typeof getChallengeSubmissions>>>;
const getChallengeSubmissions = cache(async (userId: string, slug: string) => {
  const challenge = await prisma.challenge.findFirstOrThrow({
    where: { slug },
    select: { id: true },
  });
  return prisma.submission.findMany({
    where: { challengeId: challenge.id, userId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
});

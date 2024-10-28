import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Submissions } from './_components';
import { createChallengeSubmissionCacheKey } from './cache-keys';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { getAotSlug } from '~/utils/getAotSlug';

interface Props {
  params: {
    year: string;
    day: string;
  };
}

export const metadata = {
  title: 'Submissions | TypeHero',
  description: 'View your submissions to this challenge on TypeHero.',
};

export default async function SubmissionPage({ params: { year, day } }: Props) {
  const session = await auth();

  const slug = getAotSlug({ year, day });

  const submissions = await withUnstableCache({
    fn: getChallengeSubmissions,
    args: [session?.user?.id ?? '', slug],
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

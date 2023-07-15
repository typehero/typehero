import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Submissions } from '~/components/challenge/submissions';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';

interface Props {
  params: {
    id: string;
  };
}

export default async function SubmissionPage({ params: { id } }: Props) {
  const session = await getServerAuthSession();
  const submissions = await getChallengeSubmissions(session?.user.id ?? '', id);

  if (!submissions) {
    return notFound();
  }

  return <Submissions submissions={submissions} />;
}

export const dynamic = 'force-dynamic';

export type ChallengeSubmissions = NonNullable<Awaited<ReturnType<typeof getChallengeSubmissions>>>;
export const getChallengeSubmissions = cache(async (userId: string, challengeId: string) => {
  console.log('getChallengeSubmissions');
  const solutions = await prisma.submission.findMany({
    where: { challengeId: +challengeId, userId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });

  return solutions;
});

import { notFound } from 'next/navigation';
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

export type ChallengeSubmissions = NonNullable<Awaited<ReturnType<typeof getChallengeSubmissions>>>;
export async function getChallengeSubmissions(userId: string, challengeId: string) {
  const solutions = await prisma.submission.findMany({
    where: { challengeId: +challengeId, userId },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });

  return solutions;
}

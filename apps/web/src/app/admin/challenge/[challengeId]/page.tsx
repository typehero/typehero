import { ChallengeReview } from './challenge-review';
import { prisma } from '@repo/db';

interface Props {
  params: {
    challengeId: string;
  };
}

export default async function ChallengeReviewPage({ params: { challengeId } }: Props) {
  const challenge = await getChallengeToReview(Number(challengeId));
  return <ChallengeReview challenge={challenge} />;
}

export type ChallengeToReview = NonNullable<Awaited<ReturnType<typeof getChallengeToReview>>>;
async function getChallengeToReview(id: number) {
  return prisma.challenge.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

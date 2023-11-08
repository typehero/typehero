'use server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { VoteType } from '@repo/db/types';

export async function incrementOrDecrementUpvote(
  id: number,
  rootType: VoteType,
  shouldIncrement: boolean,
) {
  const session = await getServerAuthSession();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const voteExists = await prisma.vote.findFirst({
    where: {
      rootType,
      challengeId: rootType === 'CHALLENGE' ? id : undefined,
      commentId: rootType === 'COMMENT' ? id : undefined,
      sharedSolutionId: rootType === 'SHAREDSOLUTION' ? id : undefined,
      submissionId: rootType === 'SUBMISSION' ? id : undefined,
      userId: session?.user.id ?? '',
    },
  });

  if (session?.user && !voteExists && shouldIncrement) {
    await prisma.vote.create({
      data: {
        rootType,
        challengeId: rootType === 'CHALLENGE' ? id : undefined,
        commentId: rootType === 'COMMENT' ? id : undefined,
        sharedSolutionId: rootType === 'SHAREDSOLUTION' ? id : undefined,
        submissionId: rootType === 'SUBMISSION' ? id : undefined,
        userId: session.user.id,
      },
    });
  }

  if (session?.user && voteExists && !shouldIncrement) {
    await prisma.vote.delete({
      where: {
        id: voteExists.id,
      },
    });
  }
}

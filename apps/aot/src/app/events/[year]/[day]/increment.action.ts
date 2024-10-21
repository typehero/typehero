'use server';
import { prisma } from '@repo/db';
import type { VoteType } from '@repo/db/types';
import { auth } from '~/server/auth';

export async function incrementOrDecrementUpvote({
  rootId,
  rootType,
  shouldIncrement,
}: {
  rootId: number;
  rootType: VoteType;
  shouldIncrement: boolean;
}) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  const voteExists = await prisma.vote.findFirst({
    where: {
      rootType,
      challengeId: rootType === 'CHALLENGE' ? rootId : undefined,
      commentId: rootType === 'COMMENT' ? rootId : undefined,
      sharedSolutionId: rootType === 'SHAREDSOLUTION' ? rootId : undefined,
      submissionId: rootType === 'SUBMISSION' ? rootId : undefined,
      userId: session?.user?.id ?? '',
    },
  });

  if (session?.user && voteExists && !shouldIncrement) {
    await prisma.vote.delete({
      where: {
        id: voteExists.id,
      },
    });
  }
}

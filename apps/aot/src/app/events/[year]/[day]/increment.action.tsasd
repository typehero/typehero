'use server';
import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import type { VoteType } from '@repo/db/types';
import type { PaginatedComments } from './_components/comments/getCommentRouteData';

export async function incrementOrDecrementUpvote({
  rootId,
  rootType,
  shouldIncrement,
  toUserId,
  challengeSlug,
  comment,
}: {
  rootId: number;
  rootType: VoteType;
  shouldIncrement: boolean;
  toUserId: string;
  challengeSlug: string;
  comment?: PaginatedComments['comments'][number];
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

  if (session?.user && !voteExists && shouldIncrement) {
    const notificationUrl = (rootType: VoteType) => {
      switch (rootType) {
        case 'CHALLENGE':
          // challenge/hello-world
          return `/challenge/${challengeSlug}`;
        case 'COMMENT':
          if (comment?.rootType === 'CHALLENGE') {
            // challenge/default-generic-arguments/comments/30
            return `/challenge/${challengeSlug}/comments/${rootId}`;
          }
          // challenge/hello-world/solutions/1/comments/32
          return `/challenge/${comment?.rootSolution?.challenge?.slug}/solutions/${comment?.rootSolutionId}/comments/${rootId}`;
        case 'SHAREDSOLUTION':
          // challenge/hello-world/solutions/1
          return `/challenge/${challengeSlug}/solutions/${rootId}`;
        default:
          return '';
      }
    };

    await prisma.vote.create({
      data: {
        rootType,
        challengeId: rootType === 'CHALLENGE' ? rootId : undefined,
        commentId: rootType === 'COMMENT' ? rootId : undefined,
        sharedSolutionId: rootType === 'SHAREDSOLUTION' ? rootId : undefined,
        userId: session.user.id,
      },
    });
    // dont care if this fails nor should it block
    prisma.notification
      .create({
        data: {
          type: 'LIKE',
          blurb: `liked your ${rootType.toLowerCase()}`,
          url: notificationUrl(rootType),
          challengeId: rootType === 'CHALLENGE' ? rootId : undefined,
          commentId: rootType === 'COMMENT' ? rootId : undefined,
          sharedSolutionId: rootType === 'SHAREDSOLUTION' ? rootId : undefined,
          fromUserId: session.user.id,
          toUserId,
        },
      })
      .catch(console.error);
  }

  if (session?.user && voteExists && !shouldIncrement) {
    await prisma.vote.delete({
      where: {
        id: voteExists.id,
      },
    });

    const notificationToDelete = await prisma.notification.findFirst({
      where: {
        type: 'LIKE',
        fromUserId: session.user.id,
        challengeId: rootType === 'CHALLENGE' ? rootId : undefined,
        commentId: rootType === 'COMMENT' ? rootId : undefined,
        sharedSolutionId: rootType === 'SHAREDSOLUTION' ? rootId : undefined,
        toUserId,
      },
    });

    await prisma.notification.delete({
      where: {
        id: notificationToDelete?.id,
      },
    });
  }
}

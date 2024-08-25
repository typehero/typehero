'use server';

import { prisma } from '@repo/db';
import type { Comment, PrismaClient } from '@repo/db/types';
import { auth } from '~/server/auth';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';
import type { ChallengeRouteData } from '../../[slug]/getChallengeRouteData';
import type { SolutionRouteData } from '../../[slug]/solutions/[solutionId]/getSolutionIdRouteData';
import type { PaginatedComments } from './getCommentRouteData';
import { getMentionsFromComment } from './getMentionsFromComment';

/**
 * @param comment a Challenge or Solution-based comment.
 * @returns the prisma create response.
 */
type CommentToCreate =
  | {
      text: string;
      rootType: 'CHALLENGE';
      root: ChallengeRouteData['challenge'];
    }
  | {
      text: string;
      rootType: 'SOLUTION';
      root: SolutionRouteData;
    };

export async function addComment(comment: CommentToCreate) {
  const session = await auth();

  if (!session?.user?.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';

  const commentToCreate = {
    text: comment.text,
    rootType: comment.rootType,
    ...(comment.rootType === 'CHALLENGE'
      ? { rootChallengeId: comment.root.id }
      : { rootSolutionId: comment.root.id }),
  };

  const commentThatWasCreated = await prisma.comment.create({
    data: {
      ...commentToCreate,
      userId: session.user.id,
    },
  });

  const url =
    comment.rootType === 'CHALLENGE'
      ? // /challenge/challenge-slug/comments/26
        `/challenge/${comment.root?.slug}/comments/${comment.root.id}`
      : // /challenge/challenge-slug/solutions/1/comments/32
        `/challenge/${comment.root?.challenge?.slug}/solutions/${comment.root.id}/comments/${commentThatWasCreated.id}`;
  const replyNotificationPromise =
    // dont notify yourself by commenting on your own solution/challenge
    session.user.id !== comment.root.userId
      ? [
          prisma.notification.create({
            data: {
              type: 'REPLY',
              url,
              commentId: commentThatWasCreated.id,
              fromUserId: session.user.id,
              toUserId: comment.root.userId!,
            },
          }),
        ]
      : [];
  // don't notify the solution/challenge author if they are mentioned to avoid double notifications or the comment author since they
  // shouldn't be able to notify themselves (e.g: tag themselves in their own comment)
  const mentions = getMentionsFromComment(commentToCreate.text).filter(
    (mention) => mention !== comment.root.user?.name && mention !== session.user.name,
  );

  console.log(`**********`);
  console.log({ mentions });
  console.log(`**********`);
  // don't block on notification logic
  Promise.all([
    ...mentions.map(async (mention) => {
      const validMention = await prisma.user.findFirst({
        where: {
          name: mention,
        },
      });

      console.log({ validMention });
      if (!validMention) {
        return Promise.resolve();
      }

      return prisma.notification.create({
        data: {
          type: 'MENTION',
          url,
          commentId: commentThatWasCreated.id,
          fromUserId: session.user.id,
          toUserId: validMention.id,
        },
      });
    }),
    ...replyNotificationPromise,
  ]).catch(console.error);
}

export async function replyComment(
  comment: CommentToCreate,
  parentComment: PaginatedComments['comments'][number],
) {
  const session = await auth();

  if (!session?.user?.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';

  const replyToCreate = {
    text: comment.text,
    rootType: comment.rootType,
    ...(comment.rootType === 'CHALLENGE'
      ? { rootChallengeId: comment.root.id }
      : { rootSolutionId: comment.root.id }),
  };

  const replyThatWasCreated = await prisma.comment.create({
    data: {
      ...replyToCreate,
      parentId: parentComment.id,
      userId: session.user.id,
    },
  });

  const url =
    parentComment.rootType === 'CHALLENGE'
      ? // /challenge/challenge-slug/comments/26?replyId=33
        `/challenge/${parentComment.rootChallenge?.slug}/comments/${parentComment.id}?replyId=${replyThatWasCreated.id}`
      : // /challenge/challenge-slug/solutions/1/comments/32?replyId=35
        `/challenge/${parentComment.rootSolution?.challenge?.slug}/solutions/${parentComment.rootSolutionId}/comments/${parentComment.id}?replyId=${replyThatWasCreated.id}`;

  const replyNotificationPromise =
    // dont notify yourself if you reply to your own comment
    session.user.id !== parentComment.userId
      ? [
          prisma.notification.create({
            data: {
              type: 'REPLY',
              commentId: replyThatWasCreated.id,
              url,
              fromUserId: session.user.id,
              toUserId: parentComment.userId,
            },
          }),
        ]
      : [];

  // don't notify the parent comment author if they are mentioned to avoid double notifications or the comment author since they
  // shouldn't be able to notify themselves (e.g: tag themselves in their own comment)
  const mentions = getMentionsFromComment(replyToCreate.text).filter(
    (mention) => mention != parentComment.user.name && mention != session.user.name,
  );

  // dont block on notification logic
  Promise.allSettled([
    ...mentions.map(async (mention) => {
      const validMention = await prisma.user.findFirst({
        where: {
          name: mention,
        },
      });

      if (!validMention) {
        return Promise.resolve();
      }

      return prisma.notification.create({
        data: {
          type: 'MENTION',
          url,
          commentId: comment.root.id,
          fromUserId: session.user.id,
          toUserId: validMention.id,
        },
      });
    }),
    ...replyNotificationPromise,
  ]).catch(console.error);
}

export async function updateComment(text: string, id: number) {
  const session = await auth();

  if (!session || !session.user) return 'unauthorized';
  if (text.length === 0) return 'text_is_empty';

  const comment = await prisma.comment.findFirstOrThrow({
    where: {
      id,
    },
  });

  const isAuthorized = isAdminOrModerator(session) || isAuthor(session, comment.userId);
  if (!isAuthorized) {
    return 'unauthorized';
  }

  return await prisma.comment.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      text,
    },
  });
}
/**
 * Deletes a comment given a comment ID. The user must be the author of the comment or have the role of 'ADMIN' or 'MODERATOR'.
 * @param comment_id The ID of the comment to be deleted.
 * @param author The ID of the user who authored the comment.
 * @returns 'unauthorized' if the user is not authorized, 'invalid_comment' if the comment ID is not provided, or undefined if the comment is successfully deleted.
 */
export async function deleteComment(comment_id: number) {
  const session = await auth();

  if (!session) return 'unauthorized';
  if (!comment_id) return 'invalid_comment';

  const rootComment = await prisma.comment.findFirstOrThrow({
    where: {
      id: comment_id,
    },
  });

  const isAuthorized = isAdminOrModerator(session) || isAuthor(session, rootComment.userId);
  if (!isAuthorized) {
    return 'unauthorized';
  }

  await deleteCommentWithChildren(prisma, rootComment);
}

async function deleteCommentWithChildren(prisma: PrismaClient, node: Comment) {
  const children = await prisma.comment.findMany({
    where: {
      parentId: node.id,
    },
  });

  for (const child of children) {
    await deleteCommentWithChildren(prisma, child);
  }

  await prisma.comment.delete({
    where: {
      id: node.id,
    },
  });
}

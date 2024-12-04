'use server';

import { prisma } from '@repo/db';
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
export type CommentToCreate =
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
    (mention) =>
      mention?.toLowerCase() !== comment.root.user?.name.toLowerCase() &&
      mention?.toLowerCase() !== session.user.name.toLowerCase(),
  );

  // don't block on notification logic
  Promise.all([
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
    (mention) =>
      mention?.toLowerCase() != parentComment.user.name.toLowerCase() &&
      mention?.toLowerCase() != session.user.name.toLowerCase(),
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
          commentId: replyThatWasCreated.id,
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

  if (!session?.user) return 'unauthorized';
  if (text.length === 0) return 'text_is_empty';

  const comment = await prisma.comment.findFirstOrThrow({
    include: {
      parentComment: {
        include: {
          rootChallenge: true,
          rootSolution: true,
        },
      },
      rootSolution: {
        select: {
          id: true,
          user: true,
          challenge: true,
        },
      },
      rootChallenge: {
        select: {
          user: true,
          slug: true,
        },
      },
    },
    where: {
      id,
    },
  });

  const isAuthorized = isAdminOrModerator(session) || isAuthor(session, comment.userId);
  if (!isAuthorized) {
    return 'unauthorized';
  }

  // check for mentions in both the previous version of this comment and current comment
  // anything that was removed should have its notification deleted
  // anything new should create a new notification

  // don't notify the solution/challenge author if they are mentioned to avoid double notifications or the comment author since they
  // shouldn't be able to notify themselves (e.g: tag themselves in their own comment)

  const rootUsername =
    (comment.rootType === 'CHALLENGE'
      ? comment.rootChallenge?.user.name
      : comment.rootSolution?.user?.name) ?? '';

  const newCommentMentions = getMentionsFromComment(text).filter(
    (mention) =>
      mention?.toLowerCase() !== rootUsername.toLowerCase() &&
      mention?.toLowerCase() !== session.user.name.toLowerCase(),
  );

  const originalCommentMentions = getMentionsFromComment(comment.text).filter(
    (mention) =>
      mention?.toLowerCase() !== rootUsername.toLowerCase() &&
      mention?.toLowerCase() !== session.user.name.toLowerCase(),
  );

  const removed = originalCommentMentions.filter((item) => !newCommentMentions.includes(item));
  const added = newCommentMentions.filter((item) => !originalCommentMentions.includes(item));

  if (added.length > 0) {
    // construct url for comment.
    // we must determine if its a reply or root comment

    let url = '';
    if (!comment.parentId) {
      // root comment
      url =
        comment.rootType === 'CHALLENGE'
          ? // /challenge/challenge-slug/comments/26
            `/challenge/${comment.rootChallenge?.slug}/comments/${comment.id}`
          : // /challenge/challenge-slug/solutions/1/comments/32
            `/challenge/${comment.rootSolution?.challenge?.slug}/solutions/${comment.rootSolution?.id}/comments/${comment.id}`;
    } else {
      // reply comment
      url =
        comment.rootType === 'CHALLENGE'
          ? // /challenge/challenge-slug/comments/26?replyId=33
            `/challenge/${comment.parentComment?.rootChallenge?.slug}/comments/${comment.parentComment?.id}?replyId=${comment.id}`
          : // /challenge/challenge-slug/solutions/1/comments/32?replyId=35
            `/challenge/${comment.rootSolution?.challenge?.slug}/solutions/${comment.rootSolutionId}/comments/${comment.parentComment?.id}?replyId=${comment.id}`;
    }

    // don't block on notification logic
    Promise.all([
      ...added.map(async (mention) => {
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
            commentId: comment.id,
            fromUserId: session.user.id,
            toUserId: validMention.id,
          },
        });
      }),
    ]).catch(console.error);
  }

  if (removed.length > 0) {
    Promise.all([
      ...removed.map(async (mention) => {
        const validMention = await prisma.user.findFirst({
          where: {
            name: mention,
          },
        });

        if (!validMention) {
          return Promise.resolve();
        }

        const notificationToDelete = await prisma.notification.findFirst({
          where: {
            type: 'MENTION',
            commentId: comment.id,
            fromUserId: session.user.id,
            toUserId: validMention.id,
          },
          select: {
            id: true,
          },
        });

        return prisma.notification.delete({
          where: {
            id: notificationToDelete?.id,
          },
        });
      }),
    ]).catch(console.error);
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

  const rootComment = await prisma.comment.findFirstOrThrow({
    where: {
      id: comment_id,
    },
  });

  const isAuthorized = isAdminOrModerator(session) || isAuthor(session, rootComment.userId);
  if (!isAuthorized) {
    return 'unauthorized';
  }

  const children = await prisma.comment.findMany({
    where: {
      parentId: rootComment.id,
    },
    select: {
      id: true,
    },
  });

  // have to delete noti before original comment is gone
  await prisma.notification.deleteMany({
    where: {
      commentId: {
        in: [rootComment.id, ...children.map((c) => c.id)],
      },
    },
  });
  await prisma.$transaction([
    prisma.comment.deleteMany({
      where: {
        id: {
          in: children.map((c) => c.id),
        },
      },
    }),
    prisma.comment.delete({
      where: {
        id: rootComment.id,
      },
    }),
  ]);
}

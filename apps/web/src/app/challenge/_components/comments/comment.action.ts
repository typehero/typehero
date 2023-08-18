'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { Comment, CommentRoot, PrismaClient } from '@repo/db/types';

/**
 *
 * @param comment a Challenge or Solution-based comment.
 * @returns the prisma create response.
 */
interface CommentToCreate {
  text: string;
  rootType: CommentRoot;
  rootId: number;
}
export async function addComment(comment: CommentToCreate) {
  const session = await getServerAuthSession();

  if (!session?.user.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';
  if (!session.user.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';

  const { rootId, ...commentToCreate } = {
    ...comment,
    ...(comment.rootType === 'CHALLENGE'
      ? { rootChallengeId: comment.rootId }
      : { rootSolutionId: comment.rootId }),
  };

  return await prisma.comment.create({
    data: {
      ...commentToCreate,
      userId: session.user.id,
    },
  });
}

export async function replyComment(comment: CommentToCreate, parentId: number) {
  const session = await getServerAuthSession();

  if (!session?.user.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';
  if (!session.user.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';

  const { rootId, ...commentToCreate } = {
    ...comment,
    ...(comment.rootType === 'CHALLENGE'
      ? { rootChallengeId: comment.rootId }
      : { rootSolutionId: comment.rootId }),
  };

  return await prisma.comment.create({
    data: {
      ...commentToCreate,
      parentId,
      userId: session.user.id,
    },
  });
}

export async function updateComment(text: string, id: number) {
  const session = await getServerAuthSession();

  if (!session?.user.id) return 'unauthorized';
  if (text.length === 0) return 'text_is_empty';
  if (!session.user.id) return 'unauthorized';

  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      text,
      userId: session.user.id,
    },
  });
}
/**
 * Delete's a comment given a comment id. It must
 * be your own comment.
 * @props comment_id The id of the comment.
 */
export async function deleteComment(comment_id: number) {
  const session = await getServerAuthSession();

  if (!session?.user.id) return 'unauthorized';
  if (!comment_id) return 'invalid_comment';

  const rootComment = await prisma.comment.findFirstOrThrow({
    where: {
      id: comment_id,
    },
  });

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

export type CommentsByChallengeId = NonNullable<
  Awaited<ReturnType<typeof getCommentsByChallengeId>>
>;
export async function getCommentsByChallengeId(id: number) {
  return await prisma.comment.findMany({
    where: {
      rootType: 'CHALLENGE',
      rootChallengeId: id,
      visible: true,
    },
    include: {
      user: true,
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
}

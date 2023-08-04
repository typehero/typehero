'use server';

import type { CommentRoot } from '@typehero/database';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '@typehero/database';

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
  if (!session?.user.id) return 'unauthorized';
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

export async function updateComment(text: string, id: number) {
  const session = await getServerAuthSession();

  if (!session?.user.id) return 'unauthorized';
  if (text.length === 0) return 'text_is_empty';
  if (!session?.user.id) return 'unauthorized';

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

  return await prisma.comment.delete({
    where: {
      userId: session.user.id,
      id: comment_id,
    },
  });
}

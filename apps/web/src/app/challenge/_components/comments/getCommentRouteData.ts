import 'server-only';
import { prisma } from '@repo/db';
import type { RouterOutputs } from '~/trpc/types';
import { COMMENTS_PAGE_SIZE } from './comments.constants';

export type PaginatedComments = RouterOutputs['comment']['list'];
export type PreselectedCommentMetadata =
  | NonNullable<Awaited<ReturnType<typeof getPreselectedCommentMetadata>>>
  | NonNullable<Awaited<ReturnType<typeof getPreselectedSolutionCommentMetadata>>>;

export async function getPreselectedCommentMetadata(challengeId: number, commentId: number) {
  const challengeComments = await prisma.comment.findMany({
    where: {
      rootType: 'CHALLENGE',
      rootChallengeId: challengeId,
      visible: true,
      parentId: null,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      parentId: true,
    },
  });

  const index = challengeComments.findIndex((comment) => comment.id === commentId);

  // this `commentId` couldn't be found (perhaps it was deleted)
  if (index === -1) return;

  const selectedComment = challengeComments[index];
  const page = Math.ceil((index + 1) / COMMENTS_PAGE_SIZE);

  return {
    page,
    selectedComment,
    index,
    challengeComments: challengeComments.map((comment) => comment.id),
  };
}

export async function getPreselectedSolutionCommentMetadata(
  solutionId: number,
  commentId: number,
  challengeId: number,
) {
  const solution = await prisma.sharedSolution.findFirst({
    where: {
      id: solutionId,
      challengeId,
    },
    select: { id: true },
  });

  if (!solution) return;

  const comments = await prisma.comment.findMany({
    where: {
      rootType: 'SOLUTION',
      rootSolutionId: solution.id,
      visible: true,
      parentId: null,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      parentId: true,
    },
  });

  const index = comments.findIndex((comment) => comment.id === commentId);

  // this `commentId` couldn't be found (perhaps it was deleted)
  if (index === -1) return;

  const selectedComment = comments[index];
  const page = Math.ceil((index + 1) / COMMENTS_PAGE_SIZE);

  return {
    page,
    selectedComment,
    index,
    challengeComments: comments.map((comment) => comment.id),
  };
}

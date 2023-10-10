'use server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';

interface Args {
  challengeId: number;
  description: string;
  title: string;
  userId: string;
}

export const createCacheKeyForSolutions = (challengeId: number) =>
  `challenge-${challengeId}-solutions`;

export async function postSolution({ challengeId, description, title, userId }: Args) {
  const session = await getServerAuthSession();
  if (!session) throw new Error('You must be logged in to submit a solution');

  await prisma.sharedSolution.create({
    data: {
      challengeId,
      description,
      title,
      userId,
    },
  });
  revalidateTag(createCacheKeyForSolutions(challengeId));
}

export async function deleteSolution(id: number, challengeId: number) {
  const session = await getServerAuthSession();
  const solution = await prisma.sharedSolution.findUnique({
    where: { id },
  });
  if (!isAuthor(session, solution?.userId)) {
    throw new Error('Only author can delete their solution.');
  }

  await prisma.sharedSolution.delete({
    where: { id },
  });
  revalidateTag(createCacheKeyForSolutions(challengeId));
}

export async function pinOrUnpinSolution(id: number, isPinned: boolean, challengeId: number) {
  const session = await getServerAuthSession();

  if (!isAdminOrModerator(session))
    throw new Error('You are not authorized to pin/unpin solutions');

  await prisma.sharedSolution.update({
    where: { id },
    data: { isPinned },
  });
  revalidateTag(createCacheKeyForSolutions(challengeId));
}

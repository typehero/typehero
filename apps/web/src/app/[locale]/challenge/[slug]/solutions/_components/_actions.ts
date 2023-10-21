'use server';
import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';
import type { ChallengeSolution } from '../[solutionId]/page';

interface Args {
  challengeId: number;
  description: string;
  slug: string;
  title: string;
  userId: string;
}

interface SolutionUpdateArgs {
  id: number;
  description: string;
  slug: string;
  title: string;
  userId: string;
}

export const createCacheKeyForSolutions = (slug: string) => `challenge-${slug}-solutions`;
export const createCacheKeyForSharedSolutionsTab = (userId: string) => `${userId}-shared-solutions`;

export async function updateSolution({ id, description, slug, title, userId }: SolutionUpdateArgs) {
  const session = await getServerAuthSession();
  if (!isAuthor(session, userId)) {
    throw new Error('Only author can delete their solution.');
  }

  await prisma.sharedSolution.update({
    where: { id },
    data: {
      title,
      description,
    },
  });

  revalidateTag(createCacheKeyForSolutions(slug));
}

export async function postSolution({ challengeId, description, slug, title, userId }: Args) {
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
  revalidateTag(createCacheKeyForSolutions(slug));
  revalidateTag(createCacheKeyForSharedSolutionsTab(userId));
}

export async function deleteSolution(solutionToDelete: ChallengeSolution) {
  const session = await getServerAuthSession();
  if (!isAuthor(session, solutionToDelete?.userId)) {
    throw new Error('Only author can delete their solution.');
  }

  await prisma.sharedSolution.delete({
    where: { id: solutionToDelete.id },
  });

  revalidateTag(createCacheKeyForSolutions(solutionToDelete.challenge?.slug ?? ''));
}

export async function pinOrUnpinSolution(id: number, isPinned: boolean, slug: string) {
  const session = await getServerAuthSession();

  if (!isAdminOrModerator(session))
    throw new Error('You are not authorized to pin/unpin solutions');

  await prisma.sharedSolution.update({
    where: { id },
    data: { isPinned },
  });
  revalidateTag(createCacheKeyForSolutions(slug));
}

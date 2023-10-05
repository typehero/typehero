'use server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';

interface Args {
  challengeId: number;
  description: string;
  title: string;
  userId: string;
}

export async function postSolution({ challengeId, description, title, userId }: Args) {
  await prisma.sharedSolution.create({
    data: {
      challengeId,
      description,
      title,
      userId,
    },
  });
}

export async function pinOrUnpinSolution(id: number, isPinned: boolean) {
  await prisma.sharedSolution.update({
    where: { id },
    data: { isPinned },
  });
  revalidateTag(`challenge-${id}-submissions`);
}

'use server';
import { prisma } from '~/server/db';

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

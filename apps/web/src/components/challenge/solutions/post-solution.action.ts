'use server';
import { prisma } from '@typehero/database';

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

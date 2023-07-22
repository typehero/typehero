'use server';

import { prisma } from '~/server/db';
import { getServerAuthSession } from '~/server/auth';
import { CreateChallengeSchema } from '.';

export async function uploadChallenge(data: CreateChallengeSchema) {
  const session = await getServerAuthSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return prisma.challenge.create({
    data: {
      ...data,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });
}

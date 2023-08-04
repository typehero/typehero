'use server';

import { prisma } from '@typehero/database';
import { getServerAuthSession } from '~/server/auth';
import { type CreateChallengeSchema } from '.';

export async function uploadChallenge(data: CreateChallengeSchema, isUserACreator: boolean) {
  const session = await getServerAuthSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return prisma.challenge.create({
    data: {
      ...data,
      userId: session.user.id,
      // if a user has the creator role already then their challenges dont need to be approved anymore
      ...(isUserACreator ? { status: 'ACTIVE' } : {}),
    },
    select: {
      id: true,
    },
  });
}

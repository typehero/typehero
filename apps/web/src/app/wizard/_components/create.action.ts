'use server';

import { prisma } from '@repo/db';
import { auth } from '@repo/auth/server';
import { type CreateChallengeSchema } from '.';

export async function uploadChallenge(data: CreateChallengeSchema, isUserACreator: boolean) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return prisma.challenge.create({
    data: {
      ...data,
      slug: data.name.toLowerCase().replace(/ /g, '-'),
      userId: session.user.id,
      // if a user has the creator role already then their challenges dont need to be approved anymore
      ...(isUserACreator ? { status: 'ACTIVE' } : {}),
    },
    select: {
      id: true,
    },
  });
}

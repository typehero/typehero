'use server';

import { prisma } from '~/server/db';
import { createChallengeValidator } from './create-validator';
import { getServerAuthSession } from '~/server/auth';
import { type CreateChallengeState } from './create-challenge-store';

export async function uploadChallenge(data: NonNullable<CreateChallengeState['data']>) {
  const parsedData = createChallengeValidator.parse(data);

  const session = await getServerAuthSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return prisma.challenge.create({
    data: {
      ...parsedData,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });
}

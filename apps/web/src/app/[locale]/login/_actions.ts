'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';

export async function claimBetaToken(id: number) {
  const session = getServerAuthSession();

  if (!session) {
    throw new Error('Not valid session');
  }

  return prisma.betaTokens.update({
    where: { id },
    data: { isClaimed: true },
  });
}

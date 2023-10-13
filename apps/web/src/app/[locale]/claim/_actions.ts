'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';

export async function validateToken(token: string) {
  const session = await getServerAuthSession();
  await prisma.betaTokens.update({
    where: {
      token,
    },
    data: {
      user: { connect: { id: session?.user.id } },
    },
  });
}

import type { Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { getAllFlags } from '../feature-flags';

export async function isBetaUser(session: Session | null) {
  const flags = await getAllFlags();

  const isBetaUser = await prisma.betaTokens.findFirst({
    where: {
      userId: session?.user.id ?? '',
    },
  });

  if ((!session || !isBetaUser) && flags.enableEarlyAccess) {
    return false;
  }

  return true;
}

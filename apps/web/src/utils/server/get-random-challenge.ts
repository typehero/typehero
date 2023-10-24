'use server';
import { prisma } from '@repo/db';
import type { Session } from '@repo/auth/server';

interface resultType {
  slug: string;
}

export async function getRandomChallenge(session: Session | null) {
  if (!session) {
    return null;
  }

  const result: resultType[] =
    await prisma.$queryRaw`SELECT slug FROM Challenge ORDER BY RAND() LIMIT 1`;

  if (result.length > 0 && result[0] && Boolean(result[0].slug)) {
    return result[0].slug;
  }

  return null;
}

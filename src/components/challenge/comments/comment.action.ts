'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';
import { prisma } from '~/server/db';

export async function addChallengeComment(challengeId: number, text: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) return 'unauthorized';
  if (text.length === 0) return 'text_is_empty';

  return await prisma.challengeComment.create({
    data: {
      challengeId,
      text,
      userId: session.user.id,
    },
  });
}

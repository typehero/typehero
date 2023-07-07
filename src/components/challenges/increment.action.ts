'use server';
import { prisma } from '~/server/db';

export async function incrementOrDecrementUpvote(
  challengeId: number,
  userId: string,
  shouldIncrement: boolean,
) {
  const voteExists = await prisma.vote.findFirst({
    where: {
      challengeId,
      userId,
    },
  });
  if (!voteExists && shouldIncrement) {
    await prisma.vote.create({
      data: {
        challengeId,
        userId,
      },
    });
  }
  if (voteExists && !shouldIncrement) {
    await prisma.vote.delete({
      where: {
        id: voteExists.id,
      },
    });
  }

  const count = await prisma.challenge.findFirst({
    where: { id: challengeId },
    include: {
      _count: {
        select: { vote: true },
      },
    },
  });

  return count?._count.vote;
}

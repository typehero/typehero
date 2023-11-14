'use server';
import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { Challenge } from '@repo/db/types';

/**
 * Get similar **unsolved** challenges for the given challengeId
 * 1. Get challenges with same `difficulty` that are unsolved
 * 2. Get random unsolved challenges if no problems exist for same `difficulty` that are unsolved
 * @param {number} challengeId challengeId of the challenge
 * @param {number} [maxChallenges=2] maximum number of similar challenges to return records to find
 * @returns {Promise<Challenge[]>} challenge array promise
 */
export async function getSimilarChallenges(
  challengeId: number,
  maxChallenges = 2,
): Promise<Challenge[]> {
  try {
    const session = await auth();
    const { difficulty } = await prisma.challenge.findFirstOrThrow({
      where: {
        id: challengeId,
      },
    });

    const solvedSolutions = await prisma.submission.findMany({
      where: {
        userId: session?.user.id,
        isSuccessful: true,
      },
      select: {
        challengeId: true,
      },
    });

    const challengesByDifficulty = await prisma.challenge.findMany({
      where: {
        difficulty,
        id: {
          notIn: solvedSolutions.flatMap((solution) => solution.challengeId),
        },
      },
      take: maxChallenges,
    });

    if (!challengesByDifficulty.length) {
      const firstUnsolved = await prisma.challenge.findMany({
        where: {
          id: {
            notIn: solvedSolutions.flatMap((solution) => solution.challengeId),
          },
        },
        take: maxChallenges,
      });
      return firstUnsolved;
    }

    return challengesByDifficulty;
  } catch (e) {
    console.log(e);
    return [];
  }
}

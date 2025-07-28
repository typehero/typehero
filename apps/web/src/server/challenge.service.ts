import { prisma } from '@repo/db';
import type { Difficulty } from '@repo/db/types';
import type { ChallengeWithStats } from '~/types/challenge';

export async function getChallengesWithSubmissionCounts(difficulty: string): Promise<ChallengeWithStats[]> {
  // Optimized query to get all data in one go, avoiding N+1 problem
  const challenges = await prisma.challenge.findMany({
    where: { 
      difficulty: difficulty as Difficulty,
      status: 'ACTIVE'
    },
    include: {
      _count: {
        select: { 
          vote: true, 
          comment: true 
        }
      },
      submission: {
        where: { isSuccessful: true },
        select: { 
          id: true,
          code: true,
          createdAt: true,
          isSuccessful: true,
          userId: true,
          challengeId: true
        }
      },
      user: {
        select: { name: true }
      },
      TrackChallenge: {
        include: {
          track: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: [
      { difficulty: 'asc' },
      { name: 'asc' }
    ]
  });

  // Transform the data to match our interface
  return challenges.map(challenge => {
    // Get unique user count for submissions
    const uniqueUserIds = new Set(
      challenge.submission.map(sub => sub.userId)
    );
    
    // Get track information
    const track = challenge.TrackChallenge[0]?.track || null;

    return {
      id: challenge.id,
      createdAt: challenge.createdAt,
      updatedAt: challenge.updatedAt,
      difficulty: challenge.difficulty,
      name: challenge.name,
      slug: challenge.slug,
      description: challenge.description,
      shortDescription: challenge.shortDescription,
      code: challenge.code,
      tests: challenge.tests,
      status: challenge.status,
      tsconfig: challenge.tsconfig,
      userId: challenge.userId,
      _count: {
        ...challenge._count,
        submission: uniqueUserIds.size
      },
      submission: challenge.submission,
      track,
      user: challenge.user
    };
  });
}

export async function getChallengesLengthByDifficulty(difficulty: string): Promise<number> {
  return await prisma.challenge.count({
    where: { 
      difficulty: difficulty as Difficulty,
      status: 'ACTIVE'
    }
  });
}
import { auth } from '~/server/auth';
import {
  getChallengesByTagOrDifficulty,
  getExploreChallengesLengthByTagOrDifficulty,
} from '~/app/explore/_components/explore.action';
import { ChallengeExplorerClient } from './challenge-explorer-client';
import { prisma } from '@repo/db';

const DIFFICULTIES = [
  { label: 'Beginner', tag: 'BEGINNER' },
  { label: 'Learner', tag: 'EASY' },
  { label: 'Enthusiast', tag: 'MEDIUM' },
  { label: 'Experts', tag: 'HARD' },
  { label: 'Master', tag: 'EXTREME' },
] as const;

export async function ChallengeExplorerServer() {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.warn('Auth failed, continuing without session:', error);
  }


  const allChallengesData = await Promise.all(
    DIFFICULTIES.map(async (difficulty) => {
      const challenges = await getChallengesByTagOrDifficulty(difficulty.tag);
      const challengesLength = await getExploreChallengesLengthByTagOrDifficulty(difficulty.tag);

    
      const challengesWithSubmissionCounts = await Promise.all(
        challenges.map(async (challenge) => {
          const submissionCount = await prisma.submission.findMany({
            where: {
              challengeId: challenge.id,
              isSuccessful: true,
            },
            select: {
              userId: true,
            },
            distinct: ['userId'],
          }).then(result => result.length);

          return {
            ...challenge,
            _count: {
              ...challenge._count,
              submission: submissionCount,
            },
          };
        })
      );

      const challengesWithTracks = await Promise.all(
        challengesWithSubmissionCounts.map(async (challenge) => {
          const trackChallenge = await prisma.trackChallenge.findFirst({
            where: { challengeId: challenge.id },
            include: { track: true },
          });

          return {
            ...challenge,
            track: trackChallenge?.track || null,
          };
        })
      );


      return {
        tag: difficulty.tag,
        label: difficulty.label,
        challenges: challengesWithTracks,
        challengesLength,
      };
    })
  );

  return <ChallengeExplorerClient difficulties={DIFFICULTIES} challengesData={allChallengesData} />;
}  
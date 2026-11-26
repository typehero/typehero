import { useMemo } from 'react';
import type { ChallengeWithStats } from '~/types/challenge';
import { DIFFICULTY_TO_NUMBER } from '~/constants/difficulties';

export function useChallengeData(challenges: ChallengeWithStats[]) {
  const sortedChallenges = useMemo(() => {
    return challenges.sort((a, b) => {
      const aHasSubmission = a?.submission?.length && a.submission.length > 0;
      const bHasSubmission = b?.submission?.length && b.submission.length > 0;

      if (aHasSubmission && !bHasSubmission) {
        return 1;
      }

      if (!aHasSubmission && bHasSubmission) {
        return -1;
      }

      return DIFFICULTY_TO_NUMBER[a.difficulty] !== DIFFICULTY_TO_NUMBER[b.difficulty]
        ? DIFFICULTY_TO_NUMBER[a.difficulty] - DIFFICULTY_TO_NUMBER[b.difficulty]
        : a.name.localeCompare(b.name);
    });
  }, [challenges]);

  const completedChallenges = useMemo(() => {
    return sortedChallenges
      .filter((challenge) => {
        return (
          challenge.submission.length &&
          challenge.submission.some((submission) => submission.isSuccessful)
        );
      })
      .map((challenge) => challenge.id);
  }, [sortedChallenges]);

  const inProgressChallenges = useMemo(() => {
    return sortedChallenges
      .filter((challenge) => {
        return (
          challenge.submission.length &&
          challenge.submission.every((submission) => !submission.isSuccessful)
        );
      })
      .map((challenge) => challenge.id);
  }, [sortedChallenges]);

  return {
    sortedChallenges,
    completedChallenges,
    inProgressChallenges,
  };
}

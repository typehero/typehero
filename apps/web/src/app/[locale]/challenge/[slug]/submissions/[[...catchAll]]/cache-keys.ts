export const createChallengeSubmissionCacheKey = (slug: string) => {
  return `${slug}-challenge-submissions`;
};

export const createCompletedSubmissionCacheKey = (userId: string) => {
  return `${userId}-completed-challenges`;
};

export const createInProgressSubmissionCacheKey = (userId: string) => {
  return `${userId}-in-progress-challenges`;
};

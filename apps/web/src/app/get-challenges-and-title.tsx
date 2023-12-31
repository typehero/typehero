import type {
  AllChallenges,
  ChallengesByTagOrDifficulty,
} from './[locale]/explore/_components/explore.action';

export type ChallengeType = 'beginner' | 'easy' | 'extreme' | 'hard' | 'medium' | 'popular';
export type ChallengeTitles =
  | 'Great for Beginners'
  | 'Great for Enthusiasts'
  | 'Great for Experts'
  | 'Great for Learners'
  | 'Great for Masters'
  | 'Recommended Challenges';

interface ChallengeResult {
  thisTitle: ChallengeTitles;
  challenges: ChallengesByTagOrDifficulty;
}

export function getChallengesAndTitle(
  trackName: ChallengeType,
  AC: AllChallenges,
): ChallengeResult {
  switch (trackName) {
    case 'popular':
      return { thisTitle: 'Recommended Challenges', challenges: AC.popularChallenges };
    case 'beginner':
      return { thisTitle: 'Great for Beginners', challenges: AC.beginnerChallenges };
    case 'easy':
      return { thisTitle: 'Great for Learners', challenges: AC.easyChallenges };
    case 'medium':
      return { thisTitle: 'Great for Enthusiasts', challenges: AC.mediumChallenges };
    case 'hard':
      return { thisTitle: 'Great for Experts', challenges: AC.hardChallenges };
    case 'extreme':
      return { thisTitle: 'Great for Masters', challenges: AC.extremeChallenges };
    default:
      return { thisTitle: 'Recommended Challenges', challenges: AC.popularChallenges };
  }
}

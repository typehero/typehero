import type {
  AllChallenges,
  ChallengesByTagOrDifficulty,
} from './[locale]/explore/_components/explore.action';
import { SORT_KEYS, type SortKeyType } from './problem-explorer.hooks';

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
  key: SortKeyType;
}
export function getChallengesAndTitle(
  trackName: ChallengeType,
  AC: AllChallenges,
): ChallengeResult {
  switch (trackName) {
    case 'popular':
      return {
        thisTitle: 'Recommended Challenges',
        challenges: AC.popularChallenges,
        key: SORT_KEYS[0],
      };
    case 'beginner':
      return {
        thisTitle: 'Great for Beginners',
        challenges: AC.beginnerChallenges,
        key: SORT_KEYS[1],
      };
    case 'easy':
      return {
        thisTitle: 'Great for Learners',
        challenges: AC.easyChallenges,
        key: SORT_KEYS[2],
      };
    case 'medium':
      return {
        thisTitle: 'Great for Enthusiasts',
        challenges: AC.mediumChallenges,
        key: SORT_KEYS[3],
      };
    case 'hard':
      return {
        thisTitle: 'Great for Experts',
        challenges: AC.hardChallenges,
        key: SORT_KEYS[4],
      };
    case 'extreme':
      return {
        thisTitle: 'Great for Masters',
        challenges: AC.extremeChallenges,
        key: SORT_KEYS[5],
      };
    default:
      return {
        thisTitle: 'Recommended Challenges',
        challenges: AC.popularChallenges,
        key: SORT_KEYS[0],
      };
  }
}

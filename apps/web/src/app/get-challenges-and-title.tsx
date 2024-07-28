import type {
  AllChallenges,
  ChallengesByTagOrDifficulty,
} from './explore/_components/explore.action';

export const SORT_KEYS = [
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Beginner',
    value: 'beginner',
  },
  {
    label: 'Easy',
    value: 'easy',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Hard',
    value: 'hard',
  },
  {
    label: 'Extreme',
    value: 'extreme',
  },
] as const;

export type ChallengeLabelType = (typeof SORT_KEYS)[number]['label'];

export type ChallengeType = (typeof SORT_KEYS)[number]['value'];

export interface SortKeyType {
  label: ChallengeLabelType;
  value: ChallengeType;
}
export type ChallengeTitles =
  | 'Great for Beginners'
  | 'Great for Enthusiasts'
  | 'Great for Experts'
  | 'Great for Learners'
  | 'Great for Masters'
  | 'Recommended Challenges';

interface ChallengeResult {
  title: ChallengeTitles;
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
        title: 'Recommended Challenges',
        challenges: AC.popularChallenges,
        key: SORT_KEYS[0],
      };
    case 'beginner':
      return {
        title: 'Great for Beginners',
        challenges: AC.beginnerChallenges,
        key: SORT_KEYS[1],
      };
    case 'easy':
      return {
        title: 'Great for Learners',
        challenges: AC.easyChallenges,
        key: SORT_KEYS[2],
      };
    case 'medium':
      return {
        title: 'Great for Enthusiasts',
        challenges: AC.mediumChallenges,
        key: SORT_KEYS[3],
      };
    case 'hard':
      return {
        title: 'Great for Experts',
        challenges: AC.hardChallenges,
        key: SORT_KEYS[4],
      };
    case 'extreme':
      return {
        title: 'Great for Masters',
        challenges: AC.extremeChallenges,
        key: SORT_KEYS[5],
      };
    default:
      return {
        title: 'Recommended Challenges',
        challenges: AC.popularChallenges,
        key: SORT_KEYS[0],
      };
  }
}

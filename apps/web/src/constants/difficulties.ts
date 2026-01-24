import type { Challenge } from '@repo/db/types';

export const DIFFICULTIES = [
  { label: 'Beginner', tag: 'BEGINNER' },
  { label: 'Learner', tag: 'EASY' },
  { label: 'Enthusiast', tag: 'MEDIUM' },
  { label: 'Experts', tag: 'HARD' },
  { label: 'Master', tag: 'EXTREME' },
] as const;

export const DIFFICULTY_TO_NUMBER: Record<Challenge['difficulty'], number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
  EVENT: 5,
};

export const DIFFICULTY_COLORS = {
  BEGINNER: 'text-sky-500 dark:text-sky-300',
  EASY: 'text-green-500 dark:text-green-300',
  MEDIUM: 'text-yellow-500 dark:text-yellow-300',
  HARD: 'text-red-500 dark:text-red-300',
  EXTREME: 'text-purple-500 dark:text-purple-300',
  EVENT: 'text-purple-500 dark:text-purple-300',
} as const;

export const DIFFICULTY_BORDERS = {
  BEGINNER:
    'dark:hover:border-difficulty-beginner-dark hover:border-difficulty-beginner dark:group-focus:border-difficulty-beginner-dark group-focus:border-difficulty-beginner',
  EASY: 'dark:hover:border-difficulty-easy-dark hover:border-difficulty-easy dark:group-focus:border-difficulty-easy-dark group-focus:border-difficulty-easy',
  MEDIUM:
    'dark:hover:border-difficulty-medium-dark hover:border-difficulty-medium dark:group-focus:border-difficulty-medium-dark group-focus:border-difficulty-medium',
  HARD: 'dark:hover:border-difficulty-hard-dark hover:border-difficulty-hard dark:group-focus:border-difficulty-hard-dark group-focus:border-difficulty-hard',
  EXTREME:
    'dark:hover:border-difficulty-extreme-dark hover:border-difficulty-extreme dark:group-focus:border-difficulty-extreme-dark group-focus:border-difficulty-extreme',
  EVENT:
    'dark:hover:border-difficulty-extreme-dark hover:border-difficulty-extreme dark:group-focus:border-difficulty-extreme-dark group-focus:border-difficulty-extreme',
} as const;

export const DIFFICULTY_BADGE_COLORS = {
  BEGINNER: 'dark:bg-difficulty-beginner-dark bg-difficulty-beginner',
  EASY: 'dark:bg-difficulty-easy-dark bg-difficulty-easy',
  MEDIUM: 'dark:bg-difficulty-medium-dark bg-difficulty-medium',
  HARD: 'dark:bg-difficulty-hard-dark bg-difficulty-hard',
  EXTREME: 'dark:bg-difficulty-extreme-dark bg-difficulty-extreme',
  EVENT: 'dark:bg-difficulty-extreme-dark bg-difficulty-extreme',
} as const;

export const DIFFICULTY_TITLES = {
  BEGINNER:
    'bg-clip-text text-transparent select-none bg-gradient-to-r from-sky-500 to-sky-500 dark:from-sky-500 dark:to-sky-200',
  EASY: 'bg-clip-text text-transparent select-none bg-gradient-to-r from-green-600 to-green-500 dark:from-green-300 dark:to-green-100',
  MEDIUM:
    'bg-clip-text text-transparent select-none bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-300 dark:to-yellow-100',
  HARD: 'bg-clip-text text-transparent select-none bg-gradient-to-r from-red-600 to-red-500 dark:from-red-300 dark:to-red-100',
  EXTREME:
    'bg-clip-text text-transparent select-none bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-100',
  EVENT:
    'bg-clip-text text-transparent select-none bg-gradient-to-r from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-100',
} as const;

export const DIFFICULTY_TAG_COLORS = {
  BEGINNER: 'dark:bg-sky-400/20 bg-sky-600/50',
  EASY: 'dark:bg-green-400/20 bg-green-600/50',
  MEDIUM: 'dark:bg-yellow-400/20 bg-yellow-600/50',
  HARD: 'dark:bg-red-400/20 bg-red-600/50',
  EXTREME: 'dark:bg-purple-400/20 bg-purple-600/50',
  EVENT: 'dark:bg-purple-400/20 bg-purple-600/50',
} as const;

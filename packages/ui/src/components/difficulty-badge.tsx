import { type Difficulty } from '@repo/db/types';
import { Badge } from './badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER:
    'dark:bg-pink-300 bg-pink-600 dark:group-hover/card:text-pink-300 group-hover/card:text-pink-600',
  EASY: 'dark:bg-green-300 bg-green-600 dark:group-hover/card:text-green-300 group-hover/card:text-green-600',
  MEDIUM:
    'dark:bg-yellow-300 bg-yellow-600 dark:group-hover/card:text-yellow-300 group-hover/card:text-yellow-600',
  HARD: 'dark:bg-red-300 bg-red-600 dark:group-hover/card:text-red-300 group-hover/card:text-red-600',
  EXTREME:
    'dark:bg-orange-300 bg-orange-600 dark:group-hover/card:text-orange-300 group-hover/card:text-orange-600',
};

export function DifficultyBadge({ difficulty }: Props) {
  return (
    <Badge
      className={`duration-300 group-hover/card:bg-white dark:group-hover/card:bg-black/70 ${COLORS_BY_DIFFICULTY[difficulty]}`}
    >
      {difficulty}
    </Badge>
  );
}

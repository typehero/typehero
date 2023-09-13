import { type Difficulty } from '@repo/db/types';
import { Badge } from './badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:bg-difficulty-beginner-dark bg-difficulty-beginner',
  EASY: 'dark:bg-difficulty-easy-dark bg-difficulty-easy',
  MEDIUM: 'dark:bg-difficulty-medium-dark bg-difficulty-medium',
  HARD: 'dark:bg-difficulty-hard-dark bg-difficulty-hard',
  EXTREME: 'dark:bg-difficulty-extreme-dark bg-difficulty-extreme',
};

export function DifficultyBadge({ difficulty }: Props) {
  return (
    <Badge
      className={`duration-300 ${COLORS_BY_DIFFICULTY[difficulty]} text-white dark:text-black`}
    >
      {difficulty}
    </Badge>
  );
}

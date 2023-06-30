import { Difficulty } from '@prisma/client';
import { Badge } from '../ui/badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'bg-pink-500 dark:bg-pink-300',
  EASY: 'bg-green-500 dark:bg-green-300',
  MEDIUM: 'bg-yellow-500 dark:bg-yellow-300',
  HARD: 'bg-red-500 dark:bg-red-300',
  EXTREME: 'bg-orange-500 dark:bg-orange-300',
};
export function DifficultyBadge({ difficulty }: Props) {
  return (
    <Badge
      className={`${COLORS_BY_DIFFICULTY[difficulty]} hover:${COLORS_BY_DIFFICULTY[difficulty]}}`}
    >
      {difficulty}
    </Badge>
  );
}

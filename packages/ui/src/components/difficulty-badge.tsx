import { type Difficulty } from '@repo/db/types';
import { Badge } from './badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:bg-pink-300 bg-pink-600',
  EASY: 'dark:bg-green-300 bg-green-600',
  MEDIUM: 'dark:bg-yellow-300 bg-yellow-600',
  HARD: 'dark:bg-red-300 bg-red-600',
  EXTREME: 'dark:bg-orange-300 bg-orange-600',
};

export function DifficultyBadge({ difficulty }: Props) {
  return <Badge className={`duration-300 ${COLORS_BY_DIFFICULTY[difficulty]}`}>{difficulty}</Badge>;
}

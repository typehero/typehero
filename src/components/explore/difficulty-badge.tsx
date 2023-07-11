import { type Difficulty } from '@prisma/client';
import { Badge } from '../ui/badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:bg-pink-300 bg-pink-500',
  EASY: 'dark:bg-green-300 bg-green-500',
  MEDIUM: 'dark:bg-yellow-300 bg-yellow-500',
  HARD: 'dark:bg-red-300 bg-red-500',
  EXTREME: 'dark:bg-orange-300 bg-orange-500',
};

// TODO: move this somewhere else
export function DifficultyBadge({ difficulty }: Props) {
  return <Badge className={`${COLORS_BY_DIFFICULTY[difficulty]}`}>{difficulty}</Badge>;
}

import { Difficulty } from '@prisma/client';
import { Badge } from '../ui/badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'bg-pink-300',
  EASY: 'bg-green-300',
  MEDIUM: 'bg-yellow-300',
  HARD: 'bg-red-300',
  EXTREME: 'bg-orange-300',
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

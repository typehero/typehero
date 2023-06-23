import { Difficulty } from '@prisma/client';
import { Badge } from '../ui/badge';
import clsx from 'clsx';

interface Props {
  difficulty: Difficulty;
}
export function DifficultyBadge({ difficulty }: Props) {
  return (
    <Badge
      className={clsx({
        'bg-pink-300': difficulty === 'BEGINNER',
        'bg-green-300': difficulty === 'EASY',
        'bg-yellow-300': difficulty === 'MEDIUM',
        'bg-red-300': difficulty === 'HARD',
        'bg-orange-300': difficulty === 'EXTREME',
      })}
    >
      {difficulty}
    </Badge>
  );
}

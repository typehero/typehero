import { type Difficulty } from '@repo/db/types';
import { Badge } from './badge';

interface Props {
  difficulty: Difficulty;
}

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'dark:bg-difficultyBeginnerDark bg-difficultyBeginner',
  EASY: 'dark:bg-difficultyEasyDark bg-difficultyEasy',
  MEDIUM: 'dark:bg-difficultyMediumDark bg-difficultyMedium',
  HARD: 'dark:bg-difficultyHardDark bg-difficultyHard',
  EXTREME: 'dark:bg-difficultyExtremeDark bg-difficultyExtreme',
};

export function DifficultyBadge({ difficulty }: Props) {
  return <Badge className={`duration-300 ${COLORS_BY_DIFFICULTY[difficulty]}`}>{difficulty}</Badge>;
}

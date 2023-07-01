import { ArrowBigUp } from 'lucide-react';

import { Challenges } from '.';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DifficultyBadge } from './difficulty-badge';

interface Props {
  challenge: Awaited<Challenges>[0];
}

const BORDERS_BY_DIFFICULTY = {
  BEGINNER:
    'dark:hover:border-pink-300 hover:border-pink-500 dark:group-focus:border-pink-300 group-focus:border-pink-500',
  EASY: 'dark:hover:border-green-300 hover:border-green-500 dark:group-focus:border-green-300 group-focus:border-green-500',
  MEDIUM:
    'dark:hover:border-yellow-300 hover:border-yellow-500 dark:group-focus:border-yellow-300 group-focus:border-yellow-500',
  HARD: 'dark:hover:border-red-300 hover:border-red-500 dark:group-focus:border-red-300 group-focus:border-red-500',
  EXTREME:
    'dark:hover:border-orange-300 hover:border-orange-500 dark:group-focus:border-orange-300 group-focus:border-orange-500',
};

// in miliseconds
const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  // style: 'short'
});

// TODO: typescript
const getRelativeTime = (date) => {
  const now = new Date();
  const elapsed = date - now;

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units)
    if (Math.abs(elapsed) > units[u] || u == 'second')
      return rtf.format(Math.round(elapsed / units[u]), u);
};

export function ExploreCard({ challenge }: Props) {
  return (
    <Card className={`duration-300 ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}`}>
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{challenge.name}</CardTitle>
          <CardDescription className="relative h-48 overflow-hidden pb-4">
            <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))]"></div>
            {challenge.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex">
            <div className="flex items-center">
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
            <div className="ml-4 flex items-center">
              <ArrowBigUp /> {challenge._count.Vote}
            </div>
          </div>
          <div>Updated {getRelativeTime(challenge.updatedAt)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

import { ArrowBigUp } from 'lucide-react';

import { Challenges } from '.';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DifficultyBadge } from './difficulty-badge';

interface Props {
  challenge: Awaited<Challenges>[0];
}

const BORDERS_BY_DIFFICULTY = {
  BEGINNER: 'hover:border-pink-300',
  EASY: 'hover:border-green-300',
  MEDIUM: 'hover:border-yellow-300',
  HARD: 'hover:border-red-300',
  EXTREME: 'hover:border-orange-300',
};

export function ExploreCard({ challenge }: Props) {
  return (
    <Card className={`duration-300 ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}`}>
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{challenge.name}</CardTitle>
          <CardDescription className="relative h-48 overflow-hidden pb-4">
            {/* it didn't like the div */}
            {/* <div
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ boxShadow: 'inset 0 -1.5rem 1rem -0.5rem #000' }}
            ></div> */}
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
          <div>Updated {challenge.updatedAt.toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  );
}

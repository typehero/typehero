import type { ExploreChallengeData } from '.';
import Card from '~/components/card';
import type { Difficulty } from '@prisma/client';

interface Props {
  data: ExploreChallengeData;
}

const difficultyToNumber: Record<Difficulty, number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
};

export function ExploreSection({ data }: Props) {
  const challenges = data;
  return (
    <div className="grid gap-4 @container/explore-section sm:grid-cols-2 lg:grid-cols-3">
      {challenges
        .sort((a, b) =>
          difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
            ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
            : a.name.localeCompare(b.name),
        )
        .map((challenge) => (
          <Card
            key={`challenge-${challenge.id}`}
            title={challenge.name}
            variant={challenge.difficulty}
            content="what"
            challenge={challenge}
          />
        ))}
    </div>
  );
}

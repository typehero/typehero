import Link from 'next/link';
import type { ExploreChallengeData } from '.';
import { ExploreCard } from './explore-card';
import Card from '~/components/card';
import { Difficulty } from '@prisma/client';

interface Props {
  data: ExploreChallengeData;
}

const difficultyToNumber:  Record<Difficulty, number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4
};

export async function ExploreSection({ data }: Props) {
  const challenges = await data();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 @container/explore-section">
      {challenges.sort((a, b) => difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty] ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty] : a.name.localeCompare(b.name)).map(challenge => (
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

import type { ExploreChallengeData } from '.';
import type { Difficulty } from '@prisma/client';
import Link from 'next/link';
import Card from './explore-card';
// import Card2 from '~/components/card';

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {challenges
        .sort((a, b) =>
          difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
            ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
            : a.name.localeCompare(b.name),
        )
        .map((challenge) => (
          <Link
            className="group focus:outline-none"
            href={`/challenge/${challenge.id}`}
            key={challenge.id}
          >
            <Card key={`challenge-${challenge.id}`} challenge={challenge} />
          </Link>
        ))}
      {/* <Card2
          key={`challenge-${challenge.id}`}
          title={challenge.name}
          variant={challenge.difficulty}
          content="what"
          challenge={challenge}
        /> */}
    </div>
  );
}

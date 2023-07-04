import Link from 'next/link';
import type { Challenge } from '.';
import { ExploreCard } from './explore-card';

interface Props {
  data(): Challenge;
}

export async function ExploreSection({ data }: Props) {
  const challenges = await data();
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Link
            className="group focus:outline-none"
            href={`/challenge/${challenge.id}`}
            key={challenge.id}
          >
            <ExploreCard key={challenge.id} challenge={challenge} />
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { ExploreChallengeData } from '.';
import { ExploreCard } from './explore-card';

interface Props {
  data: ExploreChallengeData;
}

export function ExploreSection({ data }: Props) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((challenge) => (
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

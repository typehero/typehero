import Link from 'next/link';
import type { Challenges } from '.';
import { TypographyH3 } from '../ui/typography/h3';
import { ExploreCard } from './explore-card';

interface Props {
  title: string;
  data(): Challenges;
}

export async function ExploreSection({ title, data }: Props) {
  const challenges = await data();
  return (
    <div>
      <TypographyH3 className="mb-3">{title}</TypographyH3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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

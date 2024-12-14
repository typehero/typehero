'use client';
import { cn } from '@repo/ui/cn';
import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useState } from 'react';
import { ExploreCard, type ExploreCardProps } from '~/app/explore/_components/explore-card';
import { DIFFICULTY_COLOR_MAP, FilterBar, type FilterOptions } from './filter-bar';

export function Challenges(props: {
  challenges: (ExploreCardProps['challenge'] & { id: number; slug: string })[];
  isOwnProfile: boolean;
  username: string;
  className?: string;
}) {
  const [filter, setFilter] = useState<FilterOptions>('ALL');
  const filteredChallenges = props.challenges.filter((c) => {
    if (filter === 'ALL') return true;
    return c.difficulty === filter;
  });

  return (
    <div className={cn('flex flex-col justify-center space-y-8', props.className)}>
      <FilterBar filter={filter} setFilter={setFilter} />
      {filteredChallenges.length === 0 ? (
        <Alert className="mx-auto w-fit md:px-8">
          <AlertTitle className="text-center leading-normal">
            <span>{props.isOwnProfile ? "You haven't" : `@${props.username} hasn't`}</span>{' '}
            completed any{' '}
            <span
              className="lowercase"
              style={{
                color: `hsl(${DIFFICULTY_COLOR_MAP[filter]})`,
              }}
            >
              {filter}
            </span>{' '}
            challenges yet
          </AlertTitle>
          {props.isOwnProfile ? (
            <AlertDescription className="flex justify-center">
              <Button variant="link" size="sm">
                <Link href={`/explore/${filter.toLowerCase()}`}>
                  Get started with your first <span className="lowercase">{filter}</span> challenge
                </Link>
              </Button>
            </AlertDescription>
          ) : null}
        </Alert>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((c) => (
          <Link
            href={
              props.isOwnProfile
                ? `/challenge/${encodeURIComponent(c.slug)}/submissions/${c.submission[0]?.id}`
                : `/challenge/${encodeURIComponent(c.slug)}`
            }
            key={c.id}
          >
            <ExploreCard challenge={c} />
          </Link>
        ))}
      </div>
    </div>
  );
}

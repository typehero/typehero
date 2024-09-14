'use client';
import { Difficulty } from '@repo/db/types';
import { Button } from '@repo/ui/components/button';
import { useState } from 'react';
import { ExploreCard, type ExploreCardProps } from '~/app/explore/_components/explore-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/toggle-group';
import { color, motion } from 'framer-motion';
import { cn } from '@repo/ui/cn';
import { Alert } from '@repo/ui/components/alert';
import Link from 'next/link';

type FilterOptions = Exclude<Difficulty, 'EVENT'> | 'ALL';

export function Challenges(props: {
  challenges: Array<ExploreCardProps['challenge'] & { id: number }>;
}) {
  const [filter, setFilter] = useState<FilterOptions>('ALL');
  const filteredChallenges = props.challenges.filter((c) => {
    if (filter === 'ALL') return true;
    return c.difficulty === filter;
  });

  return (
    <div className="flex flex-col justify-center space-y-8">
      <FilterBar filter={filter} setFilter={setFilter} />
      {filteredChallenges.length === 0 ? (
        <Alert className="">
          <p>
            This user hasn't completed any <span className="lowercase">{filter}</span> challenges
            yet
          </p>
        </Alert>
      ) : null}
      <div className="grid grid-cols-3 gap-4">
        {filteredChallenges.map((c) => (
          <ExploreCard key={c.id} challenge={c} className="min-w-fit xl:min-w-fit" />
        ))}
      </div>
    </div>
  );
}

const DIFFICULTY_COLOR_MAP: Record<FilterOptions, string> = {
  ALL: 'hsl(0, 0%, 50%)', // Neutral grey for "ALL"
  BEGINNER: 'hsl(199, 80%, 62%)', // Reduced brightness for BEGINNER
  EASY: 'hsl(142, 87%, 63%)', // Reduced brightness for EASY
  MEDIUM: 'hsl(31, 96%, 50%)', // Reduced brightness for MEDIUM
  HARD: 'hsl(0, 100%, 61%)', // Reduced brightness for HARD
  EXTREME: 'hsl(269, 100%, 75%)', // Reduced brightness for EXTREME
};

function FilterBar(props: { filter: FilterOptions; setFilter: (val: FilterOptions) => void }) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<null | FilterOptions>(null);
  const difficulties: FilterOptions[] = ['ALL', 'BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'];
  const [lastSelected, setLastSelected] = useState<FilterOptions>('ALL');
  console.log({
    lastSelected,
    selected: props.filter,
  });
  return (
    <ToggleGroup
      type="single"
      onMouseLeave={() => setHoveredDifficulty(null)}
      value={props.filter}
      onValueChange={(val: FilterOptions | '') => {
        if (val === '') {
          return;
        }
        setLastSelected(props.filter);
        props.setFilter(val);
      }}
    >
      {difficulties.map((difficulty) => (
        <ToggleGroupItem
          key={difficulty}
          value={difficulty}
          asChild
          className="hover:text-foreground hover:bg-transparent data-[state=on]:bg-transparent"
        >
          <button className="relative " onMouseEnter={() => setHoveredDifficulty(difficulty)}>
            <span className="z-20">{difficulty}</span>
            {props.filter === difficulty ? (
              <motion.div
                layoutId="underline"
                variants={{
                  start: ([lastSelected]: [FilterOptions, FilterOptions]) => ({
                    backgroundColor: DIFFICULTY_COLOR_MAP[lastSelected],
                  }),
                  end: ([_, selected]: [FilterOptions, FilterOptions]) => ({
                    backgroundColor: DIFFICULTY_COLOR_MAP[selected],
                  }),
                }}
                initial="start"
                animate="end"
                custom={[lastSelected, props.filter]}
                transition={{ duration: 0.3 }}
                className="bg-muted absolute -bottom-2 left-0 h-1 w-full"
              />
            ) : null}
            {hoveredDifficulty == difficulty ? (
              <motion.div
                transition={{ duration: 0.15 }}
                layoutId="hover"
                className={cn('bg-muted absolute inset-0 rounded-md')}
              />
            ) : null}
          </button>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

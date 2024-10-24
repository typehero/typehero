'use client';
import { ToggleGroup, ToggleGroupItem } from '@repo/ui/components/toggle-group';
import { motion } from 'framer-motion';
import { cn } from '@repo/ui/cn';
import { useState } from 'react';
import type { Difficulty } from '@repo/db/types';

export type FilterOptions = Exclude<Difficulty, 'EVENT'> | 'ALL';

export const DIFFICULTY_COLOR_MAP: Record<FilterOptions, string> = {
  ALL: 'var(--foreground)', // Neutral grey for "ALL"
  BEGINNER: 'var(--difficulty-beginner)', // Using CSS variable for BEGINNER
  EASY: 'var(--difficulty-easy)', // Using CSS variable for EASY
  MEDIUM: 'var(--difficulty-medium)', // Using CSS variable for MEDIUM
  HARD: 'var(--difficulty-hard)', // Using CSS variable for HARD
  EXTREME: 'var(--difficulty-extreme)',
};

export function FilterBar(props: {
  filter: FilterOptions;
  setFilter: (val: FilterOptions) => void;
}) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<FilterOptions | null>(null);
  const difficulties: FilterOptions[] = ['ALL', 'BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'];
  const [lastSelected, setLastSelected] = useState<FilterOptions>('ALL');

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
      className="flex-wrap"
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
                initial={
                  {
                    '--color-line': DIFFICULTY_COLOR_MAP[lastSelected],
                  } as unknown as Record<string, string>
                }
                animate={
                  {
                    '--color-line': DIFFICULTY_COLOR_MAP[props.filter],
                  } as unknown as Record<string, string>
                }
                style={{
                  backgroundColor: 'hsl(var(--color-line))',
                }}
                transition={{ duration: 0.3 }}
                className="absolute -bottom-2 left-0 h-1 w-full"
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

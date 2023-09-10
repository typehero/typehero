'use client';

import type { Tracks } from './track-grid';
import { Card, CardContent } from '@repo/ui/components/card';
import { Badge } from '@repo/ui/components/badge';
import Link from 'next/link';
import { clsx } from 'clsx';
import { Swords } from '@repo/ui/icons';

interface TrackProps {
  index: number;
  track: Tracks[number];
}

const BGS_BY_TRACK: Record<number, string> = {
  0: 'to-difficulty-beginner/30 dark:to-difficulty-beginner-dark/20',
  1: 'to-difficulty-easy/30 dark:to-difficulty-easy-dark/20',
  2: 'to-difficulty-medium/30 dark:to-difficulty-medium-dark/20',
  3: 'to-difficulty-hard/30 dark:to-difficulty-hard-dark/20',
  4: 'to-difficulty-extreme/30 dark:to-difficulty-extreme-dark/20',
  5: 'to-difficulty-hard/10 dark:to-difficulty-hard-dark/10',
  6: 'to-difficulty-medium/10 dark:to-difficulty-medium-dark/10',
  7: 'to-difficulty-easy/10 dark:to-difficulty-easy-dark/10',
  8: 'to-difficulty-beginner/10 dark:to-difficulty-beginner-dark/10',
  9: 'to-difficulty-extreme/10 dark:to-difficulty-extreme-dark/10',
} as const;

export function TrackCard({ track, index }: TrackProps) {
  return (
    <Link href={`/tracks/${track.id}`} className="group">
      <Card
        className={clsx(
          'group-hover:border-blue-300 group-focus:border-blue-300',
          'dark:group-hover:border-white dark:group-hover:border-opacity-20 dark:group-focus:border-white dark:group-focus:border-opacity-20',
          'transition-colors duration-300',
        )}
      >
        <CardContent className="flex items-center gap-5 p-2 pr-4">
          <div
            className={clsx(
              `bg-gradient-to-r from-neutral-500/10 from-10% ${BGS_BY_TRACK[index]} relative to-100% dark:from-neutral-500/20`,
              'flex h-24 w-24 flex-none items-center justify-center rounded-2xl',
            )}
          >
            <Swords
              size={50}
              className="opacity-50 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold capitalize tracking-wide">{track.title}</span>
              <Badge className="flex-none">{track._count.trackChallenges} Challenges</Badge>
            </div>

            <span className="text-muted-foreground mt-3 line-clamp-3 block h-8 text-xs tracking-wide">
              {track.description}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

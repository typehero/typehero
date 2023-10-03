'use client';

import { Badge } from '@repo/ui/components/badge';
import { Card, CardContent } from '@repo/ui/components/card';
import { Swords } from '@repo/ui/icons';
import { clsx } from 'clsx';
import Link from 'next/link';
import type { Tracks } from './track-grid';

interface TrackProps {
  track: Tracks[number];
}

// The color for track.
export const BGS_BY_TRACK: Record<number, string> = {
  0: 'to-difficulty-beginner/30 dark:to-difficulty-beginner-dark/20',
  1: 'to-difficulty-easy/30 dark:to-difficulty-easy-dark/20',
  2: 'to-difficulty-medium/30 dark:to-difficulty-medium-dark/20',
  3: 'to-difficulty-hard/30 dark:to-difficulty-hard-dark/20',
  4: 'to-difficulty-extreme/30 dark:to-difficulty-extreme-dark/20',
} as const;
export const bgsArray = Object.values(BGS_BY_TRACK);

const EnrolledBadge = ({ text = 'Enrolled' }: { text?: string }) => (
  <div
    className={clsx(
      'absolute -right-[1px] -top-[27px] z-[-1] rounded rounded-tl-lg rounded-tr-xl px-5 pb-10 pt-[3px] text-sm',
      'border border-blue-400 bg-blue-400 text-white',
    )}
  >
    {text}
  </div>
);

export function TrackCard({ track }: TrackProps) {
  const isEnrolled = Boolean(track.enrolledUsers?.length);

  return (
    <Link href={`/tracks/${track.id}`} className="group">
      <Card
        className={clsx(
          'relative transition-colors duration-300',
          isEnrolled
            ? 'border-blue-400'
            : 'group-hover:border-blue-400 group-focus:border-blue-400',
        )}
      >
        {isEnrolled ? <EnrolledBadge /> : null}
        <CardContent className="flex flex-col items-center gap-5 p-8">
          <div
            className={clsx(
              `bg-gradient-to-r from-neutral-500/10 from-10% ${
                BGS_BY_TRACK[track.id % bgsArray.length]
              } relative to-100% dark:from-neutral-500/20`,
              'flex h-24 w-24 flex-none items-center justify-center rounded-2xl',
            )}
          >
            <Swords
              size={50}
              className={clsx(
                'transition-opacity duration-300',
                !isEnrolled && 'opacity-50 group-hover:opacity-100 group-focus:opacity-100',
              )}
            />
          </div>
          <div className="text-center font-semibold capitalize tracking-wide">{track.title}</div>
          <div className="text-muted-foreground line-clamp-3 text-center text-sm tracking-wide">
            {track.description}
          </div>

          <div className="text-center">
            <Badge className="flex-none">{track._count.trackChallenges} Challenges</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

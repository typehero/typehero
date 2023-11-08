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
  <div className="text-background absolute left-0 top-0 z-10 rounded-br-3xl bg-[#3078c5] px-5 py-1.5 text-sm font-bold dark:bg-blue-400">
    {text}
  </div>
);

export function TrackCard({ track }: TrackProps) {
  const isEnrolled = Boolean(track.enrolledUsers?.length);

  return (
    <Link href={`/tracks/${track.slug}`} className="group">
      <Card
        className={clsx(
          'relative overflow-hidden duration-300',
          isEnrolled
            ? 'border-[#3078c5] dark:border-blue-400'
            : 'dark:group-hover:border-border group-hover:border-neutral-400 group-hover:shadow-xl group-focus:border-neutral-500 dark:group-hover:shadow dark:group-hover:shadow-neutral-400/70',
        )}
      >
        <div className="absolute -bottom-12 -left-4 w-full -translate-x-1/4 translate-y-1/4 rotate-[30deg]">
          <div
            className={clsx(
              '-ml-4 h-12 w-full border-t bg-gradient-to-r to-white duration-500 group-hover:-translate-y-1 dark:to-[#09090b]',
              isEnrolled
                ? 'border-blue-500/50 from-blue-100 dark:border-blue-400/50 dark:from-[#2b4567]'
                : 'border-neutral-500/50 from-neutral-100 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150',
            )}
          />
          <div
            className={clsx(
              '-ml-8 h-12 w-full border-t bg-gradient-to-r to-white duration-500 group-hover:-translate-y-5 dark:to-[#09090b]',
              isEnrolled
                ? 'border-blue-500/50 from-blue-100 dark:border-blue-400/50 dark:from-[#2b4567]'
                : 'border-neutral-500/50 from-neutral-100 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150',
            )}
          />
          <div
            className={clsx(
              '-ml-12 h-12 w-full border-t bg-gradient-to-r to-white duration-500 group-hover:-translate-y-8 dark:to-[#09090b]',
              isEnrolled
                ? 'border-blue-500/50 from-blue-100 dark:border-blue-400/50 dark:from-[#2b4567]'
                : 'border-neutral-500/50 from-neutral-100 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150',
            )}
          />
          <div
            className={clsx(
              '-ml-16 h-12 w-full border-t bg-gradient-to-r to-white duration-500 group-hover:-translate-y-12 dark:to-[#09090b]',
              isEnrolled
                ? 'border-blue-500/50 from-blue-100 dark:border-blue-400/50 dark:from-[#2b4567]'
                : 'border-neutral-500/50 from-neutral-100 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150',
            )}
          />
        </div>
        {isEnrolled ? <EnrolledBadge /> : null}
        <CardContent className="relative z-10 flex flex-col items-center gap-5 p-8">
          <div
            className={clsx(
              `bg-gradient-to-r from-neutral-500/10 from-10% ${
                BGS_BY_TRACK[track.id % bgsArray.length]
              } relative to-100% dark:from-neutral-900`,
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
          <div className="text-center font-semibold capitalize tracking-wide">{track.name}</div>
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

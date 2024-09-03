import { Badge } from '@repo/ui/components/badge';
import { Card, CardContent } from '@repo/ui/components/card';
import { Swords } from '@repo/ui/icons';
import { clsx } from 'clsx';
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
  <div className="absolute top-0 left-0 z-10 rounded-br-xl bg-blue-400 px-5 py-1.5 font-bold text-background text-sm">
    {text}
  </div>
);

export function TrackCardSoon({ track }: TrackProps) {
  const isEnrolled = Boolean(track.enrolledUsers?.length);

  return (
    <div className="group">
      <Card
        className={clsx(
          'relative overflow-hidden border-dashed duration-300',
          isEnrolled
            ? 'border-blue-400'
            : 'group-hover:border-neutral-400/50 group-focus:border-neutral-500 dark:group-hover:border-neutral-400/50',
        )}
      >
        <div className="-bottom-12 -left-4 -translate-x-1/4 absolute w-full translate-y-1/4 rotate-[30deg]">
          <div className="-ml-4 h-12 w-full border-neutral-500/50 border-t bg-gradient-to-r from-neutral-100 to-transparent duration-500 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150" />
          <div className="-ml-8 h-12 w-full border-neutral-500/50 border-t bg-gradient-to-r from-neutral-100 to-transparent duration-500 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150" />
          <div className="-ml-12 h-12 w-full border-neutral-500/50 border-t bg-gradient-to-r from-neutral-100 to-transparent duration-500 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150" />
          <div className="-ml-16 h-12 w-full border-neutral-500/50 border-t bg-gradient-to-r from-neutral-100 to-transparent duration-500 dark:border-neutral-700/50 dark:from-neutral-900 dark:group-hover:brightness-150" />
        </div>
        {isEnrolled ? <EnrolledBadge /> : null}
        <CardContent className="relative z-10 flex flex-col items-center gap-6 p-9">
          <div
            className={clsx(
              `relative bg-gradient-to-r from-10% from-neutral-500/10 to-100% to-neutral-500/50 dark:from-neutral-900 dark:to-neutral-500/50`,
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
          <div className="line-clamp-3 text-center text-muted-foreground text-sm tracking-wide">
            This track is still in development. <br /> Check back soon!
            <br />
          </div>

          <div className="text-center">
            <Badge className="flex-none bg-neutral-600">coming soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

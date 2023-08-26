import { Button } from '@repo/ui';
import { TrendingUpIcon } from '@repo/ui/icons';
import clsx from 'clsx';
import type { Tracks } from '~/app/tracks/_components';
import { prettifyNumbers } from '~/utils/stringUtils';
import { TrackChallenge } from './track-challenge-card';

interface TrackProps {
  track: Tracks[number];
}

export function TrackCard({ track }: TrackProps) {
  return (
    <div
      className={clsx(
        'flex min-w-[350px] flex-col justify-start space-y-4 p-4',
        'max-md:scale-110',
      )}
    >
      <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
        <span className="flex items-center gap-1 text-sm font-semibold tracking-wide">
          {track.title}
        </span>
      </div>
      <div className="flex w-full items-center justify-between gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
        <span className="text-muted-foreground flex h-10 items-center gap-1 text-sm font-semibold tracking-wide">
          {track.description.length > 80
            ? `${track.description.substring(0, 80)}...`
            : track.description}
        </span>
      </div>
      <div className="flex w-full flex-row justify-start gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
        <TrendingUpIcon size={18} />
        <span className="text-muted-foreground flex items-center gap-1 text-sm font-semibold tracking-wide">
          {`${prettifyNumbers(track._count.enrolledUsers)}`}
        </span>
      </div>
      <section className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem]">
        {track.trackChallenges
          .sort((a, b) => (a.orderId < b.orderId ? a.orderId : b.orderId))
          .map((trackChallenge, idx) => {
            if (idx > 2) return <></>;
            return <TrackChallenge challenge={trackChallenge.challenge} key={trackChallenge.id} />;
          })}
        <Button variant={'outline'}>More</Button>
      </section>
    </div>
  );
}

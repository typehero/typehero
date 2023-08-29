'use client';

import { Button } from '@repo/ui';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import type { Tracks } from '~/app/tracks/_components/track-popular-section';
import { TrackChallenge } from './track-challenge-card';

interface TrackProps {
  track: Tracks[number];
}

export function TrackCard({ track }: TrackProps) {
  const router = useRouter();
  // todo: help resolve max-md issue on hover.
  return (
    <div className="relative w-full">
      <div className="w-full">
        <div
          className={clsx(
            'relative inset-0 flex max-w-[400px] flex-col justify-start space-y-4',
            'max-md:scale-110',
          )}
        >
          <div className="flex w-[69%] items-center justify-between gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
            <span className="flex items-center gap-1 text-sm font-semibold tracking-wide">
              {track.title}
            </span>
          </div>
          <div className="flex w-full items-center justify-between gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
            <span className="text-muted-foreground flex h-10 gap-1 overflow-hidden text-sm font-semibold tracking-wide">
              {track.description}
            </span>
          </div>
          {/** If you want to show any other statistics at a glance. This might be a good section. Uncomment & remove the children within it before using it. */}
          {/* <div className="flex w-full flex-row justify-start gap-3 rounded-b-lg rounded-t-xl bg-neutral-500/10 p-2 pl-3">
            <TrendingUpIcon size={18} />
            <span className="text-muted-foreground flex items-center gap-1 text-sm font-semibold tracking-wide">
              {`${prettifyNumbers(track._count.enrolledUsers)}`}
            </span>
          </div> */}
          <div className="flex flex-col gap-2">
            {track.trackChallenges
              // get the first 3
              .slice(0, 3)
              .sort((a, b) => {
                return a.orderId - b.orderId;
              })
              .map((trackChallenge, idx) => {
                return (
                  <TrackChallenge
                    challenge={trackChallenge.challenge}
                    key={`track-challenge-${trackChallenge.id}-${track.id}`}
                  />
                );
              })}
            <Button
              variant="outline"
              onClick={() => {
                router.push(`/tracks/${track.id}`);
              }}
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

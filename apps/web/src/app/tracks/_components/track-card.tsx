'use client';

import { Button } from '@repo/ui';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { TrackChallenge } from './track-challenge-card';
import type { Tracks } from './track-grid';

interface TrackProps {
  track: Tracks[number];
}

export function TrackCard({ track }: TrackProps) {
  const router = useRouter();
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
          <div className="flex flex-col gap-2">
            {track.trackChallenges.map((trackChallenge) => {
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

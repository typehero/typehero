import { DifficultyBadge, TypographyH3 } from '@repo/ui';
import type { Tracks } from '~/app/tracks/_components';

interface TrackProps {
  track: Tracks[number];
}

export function TrackCard({ track }: TrackProps) {
  return (
    <div className="border-border flex w-[30ch] flex-col space-y-4 rounded-md border p-5">
      <div className="flex flex-col space-y-2">
        <TypographyH3>{track.title}</TypographyH3>
      </div>
      <div className="flex flex-col space-y-2">
        {track.trackChallenges
          .sort((a, b) => (a.orderId < b.orderId ? a.orderId : b.orderId))
          .map((c) => {
            return <ChallengeTrackCard challenge={c} key={c.id} />;
          })}
      </div>
    </div>
  );
}

interface ChallengeTrackProps {
  challenge: Tracks[number]['trackChallenges'][number];
}

export function ChallengeTrackCard({ challenge }: ChallengeTrackProps) {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg bg-neutral-500/10 p-4 text-zinc-700 duration-300 hover:scale-105 hover:rounded-xl active:scale-100 active:duration-75 group-hover:hover:bg-neutral-500/20 peer-checked/1:bg-pink-300/50
    peer-checked/1:hover:bg-pink-300/50 dark:text-zinc-300 peer-checked/1:dark:text-white"
    >
      <span className="text-sm">{challenge.challenge.name}</span>
      <DifficultyBadge difficulty={challenge.challenge.difficulty} />
    </div>
  );
}

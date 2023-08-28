import type { Difficulty, Tags } from '@repo/db/types';
import { COLORS_BY_TAGS } from '~/app/explore/_components/explore-section';
import { TrackCard } from '~/app/tracks/_components/track-card';
import type { Tracks } from '.';

interface PopularTrackSectionProps {
  title: string;
  tracks: Tracks;
  tag: Difficulty | Tags;
}

export function PopularTrackSection({ title, tracks, tag }: PopularTrackSectionProps) {
  return (
    <div>
      <div className="container flex items-center justify-between gap-3 px-4 pt-5">
        <h2 className="relative text-3xl font-bold tracking-tight">
          <div
            className={`absolute -left-8 -z-10 h-12 w-32 rounded-full bg-neutral-300/50 blur-3xl ${COLORS_BY_TAGS[tag]}`}
          />
          {title}
        </h2>
      </div>
      <section className="grid w-full grid-flow-row grid-cols-1 gap-4 overflow-hidden rounded-[2.5rem] p-8 md:grid-cols-2 lg:grid-cols-3">
        {tracks?.map((t) => <TrackCard key={`popular-track-${t.id}`} track={t} />)}
      </section>
    </div>
  );
}

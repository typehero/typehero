import type { Difficulty, Tags } from '@repo/db/types';
import type { PopularTracks } from '.';
import { COLORS_BY_TAGS } from '~/app/explore/_components/explore-section';
import { ViewMoreButton } from '~/app/explore/_components/view-more-button';
import { TrackCard } from '~/app/tracks/_components/track-card';
import { Carousel } from '~/components/ui/carousel';

interface PopularTrackSectionProps {
  title: string;
  tracks: PopularTracks;
  redirectRoute: string;
  tag: Difficulty | Tags;
}

export function PopularTrackSection({
  title,
  tracks,
  redirectRoute,
  tag,
}: PopularTrackSectionProps) {
  return (
    <div>
      <div className="container flex items-center justify-between gap-3 px-4 pt-5">
        <h2 className="relative text-3xl font-bold tracking-tight">
          <div
            className={`absolute -left-8 -z-10 h-12 w-32 rounded-full bg-neutral-300/50 blur-3xl ${COLORS_BY_TAGS[tag]}`}
          />
          {title}
        </h2>
        <ViewMoreButton tag={tag} redirectRoute={redirectRoute} />
      </div>
      <section className="relative flex w-full flex-row gap-4 overflow-hidden rounded-[2.5rem]">
        <Carousel>
          {tracks?.map((t) => {
            return <TrackCard key={`track-${t.id}`} track={t} />;
          })}
        </Carousel>
      </section>
    </div>
  );
}

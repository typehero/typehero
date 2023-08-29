import { prisma } from '@repo/db';
import { COLORS_BY_TAGS } from '~/app/explore/_components/explore-section';
import { TrackCard } from '~/app/tracks/_components/track-card';

export async function PopularTrackSection() {
  const tracks = await getTracks();
  return (
    <div className="container flex items-center justify-between gap-3">
      <section className="grid w-full grid-flow-row grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {tracks?.map((t) => <TrackCard key={`popular-track-${t.id}`} track={t} />)}
      </section>
    </div>
  );
}

export type Tracks = Awaited<ReturnType<typeof getTracks>>;

/**
 * Fetches all tracks.
 */
function getTracks() {
  return prisma.track.findMany({
    include: {
      trackChallenges: {
        include: {
          challenge: true,
        },
      },
    },
    where: {
      visible: true,
    },
    orderBy: {
      title: 'asc',
    },
  });
}

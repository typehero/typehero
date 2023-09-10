import { prisma } from '@repo/db';
import { TrackCard } from './track-card';

export async function TrackGrid() {
  const tracks = await getTracks();
  return (
    <div className="container flex items-center justify-between gap-3">
      <section className="grid w-full grid-flow-row grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {tracks?.map((t, i) => <TrackCard key={`track-${t.id}`} index={i} track={t} />)}
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
      _count: {
        select: {
          trackChallenges: true,
        },
      },
    },
    where: {
      visible: true,
    },
  });
}

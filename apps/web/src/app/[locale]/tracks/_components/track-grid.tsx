import { prisma } from '@repo/db';
import { TrackCard } from './track-card';

export async function TrackGrid() {
  const tracks = await getTracks();
  return (
    <div className="container flex items-center justify-between gap-3">
      <section className="grid w-full grid-flow-row grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {tracks?.map((t) => <TrackCard key={`track-${t.id}`} track={t} />)}
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
        orderBy: {
          orderId: 'asc',
        },
        take: 3,
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

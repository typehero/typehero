import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { TrackCard } from './track-card';

export async function TrackGrid() {
  const tracks = await getTracks();
  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="container relative text-3xl font-bold tracking-tight">
        <div className="absolute -left-8 -z-10 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
        <h3>All Tracks ✨</h3>
      </div>
      <section className="container grid w-full grid-flow-row grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {tracks?.map((t) => <TrackCard key={`track-${t.id}`} track={t} />)}
      </section>
    </div>
  );
}

export type Tracks = Awaited<ReturnType<typeof getTracks>>;

/**
 * Fetches all tracks.
 */
async function getTracks() {
  const session = await getServerAuthSession();
  return prisma.track.findMany({
    include: {
      _count: {
        select: {
          trackChallenges: true,
        },
      },
      enrolledUsers: {
        where: {
          id: session?.user.id ?? '',
        },
      },
    },
    where: {
      visible: true,
    },
  });
}

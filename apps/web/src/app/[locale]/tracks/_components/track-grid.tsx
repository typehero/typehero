import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { TrackCard } from './track-card';

export async function TrackGrid() {
  const tracks = await withUnstableCache({
    fn: getTracks,
    args: [],
    keys: ['tracks'],
    tags: ['tracks'],
  });
  return (
    <div className="container flex items-center justify-between gap-3">
      <section className="grid w-full grid-flow-row grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {tracks?.map((track) => <TrackCard key={`track-${track.id}`} track={track} />)}
      </section>
    </div>
  );
}

export type Tracks = Awaited<ReturnType<typeof getTracks>>;

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

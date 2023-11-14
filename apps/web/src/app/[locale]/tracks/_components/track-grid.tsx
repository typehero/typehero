import { auth, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { TrackCard } from './track-card';
import { TrackCardSoon } from './track-card-soon';
import { createTrackGridCacheKey } from './track.action';

export async function TrackGrid() {
  const session = await auth();

  const tracks = await withUnstableCache({
    fn: getTracks,
    args: [session],
    keys: [createTrackGridCacheKey(session?.user.id ?? '')],
    tags: [createTrackGridCacheKey(session?.user.id ?? '')],
  });
  return (
    <div className="container">
      <section className="w-[calc(100% + 8rem)] grid grid-cols-1 gap-4 sm:px-8 md:-mx-16 md:grid-cols-2 md:px-0 lg:mx-0 lg:w-full xl:grid-cols-3 2xl:gap-8">
        {tracks?.map((track) => {
          if (track.isComingSoon) {
            return <TrackCardSoon key={`track-${track.id}`} track={track} />;
          }

          return <TrackCard key={`track-${track.id}`} track={track} />;
        })}
      </section>
    </div>
  );
}

export type Tracks = Awaited<ReturnType<typeof getTracks>>;

async function getTracks(session: Session | null) {
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
    orderBy: {
      isComingSoon: 'asc',
    },
  });
}

import { getServerAuthSession, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { TrackCard } from '~/components/tracks/track-card';

export async function Tracks() {
  const session = await getServerAuthSession();

  const enrolledTracks = await getUserEnrolledTracks(session);
  const tracks = await getPopularTracks();

  return (
    <div className="container flex flex-col gap-8 md:pb-20">
      <div>
        {enrolledTracks?.tracks.map((et) => {
          return (
            <div key={et.id}>
              <div>{et.title}</div>
              <div>{et.description}</div>
            </div>
          );
        })}
      </div>
      <section className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem]">
        {tracks?.map((t) => {
          return <TrackCard key={t.id} track={t} />;
        })}
      </section>
    </div>
  );
}

function getUserEnrolledTracks(session: Session | null) {
  return prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      tracks: {
        orderBy: {
          title: 'asc',
        },
      },
    },
  });
}

export type Tracks = Awaited<ReturnType<typeof getPopularTracks>>;

function getPopularTracks() {
  return prisma.track.findMany({
    include: {
      trackChallenges: {
        include: {
          challenge: true,
        },
      },
      _count: {
        select: {
          enrolledUsers: true,
        },
      },
    },
    where: {
      visible: true,
    },
    orderBy: {
      enrolledUsers: {
        _count: 'desc',
      },
    },
    take: 6,
  });
}

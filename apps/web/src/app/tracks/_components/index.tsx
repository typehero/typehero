import { getServerAuthSession, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { TrackCard } from '~/components/tracks/track-card';

export async function Tracks() {
  const session = await getServerAuthSession();

  const enrolledTracks = await getUserEnrolledTracks(session);
  const tracks = await getTracks();

  return (
    <div className="container flex flex-col gap-8 py-5 md:gap-20 md:pb-20">
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
      <div className="flex flex-row gap-4">
        {tracks?.map((t) => {
          return <TrackCard key={t.id} track={t} />;
        })}
      </div>
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

export type Tracks = Awaited<ReturnType<typeof getTracks>>;

function getTracks() {
  return prisma.track.findMany({
    include: {
      trackChallenges: {
        include: {
          challenge: true,
        },
      },
      user: true,
    },
    where: {
      visible: true,
    },
    orderBy: {
      title: 'asc',
    },
  });
}

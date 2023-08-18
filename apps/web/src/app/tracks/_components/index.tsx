import { getServerAuthSession, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';

export async function Tracks() {
  const session = await getServerAuthSession();

  const enrolledTracks = await getUserEnrolledTracks(session);
  const tracks = await getTracks();

  return (
    <div>
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
      {tracks?.map((t) => {
        return (
          <div key={t.id}>
            <div>{t.title}</div>
            <div>{t.description}</div>
          </div>
        );
      })}
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
function getTracks() {
  return prisma.track.findMany({
    include: {
      trackChallenges: true,
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

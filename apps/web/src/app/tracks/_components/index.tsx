import { getServerAuthSession, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { EnrolledTrackSection } from './track-enrolled-section';
import { PopularTrackSection } from './track-popular-section';

export async function Tracks() {
  const session = await getServerAuthSession();

  const enrolledTracks = await getUserEnrolledTracks(session);
  const tracks = await getTracks();

  return (
    <div className="flex flex-col gap-8 py-8 md:gap-10 md:py-10">
      <div className="container">
        <h3 className="mb-1 text-2xl font-bold tracking-wide text-neutral-900/40 dark:text-white/40">
          Welcome to
        </h3>
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          TypeHero Tracks
        </h1>
        <p className=" max-w-[69ch] text-lg leading-10 text-neutral-600 dark:text-white/50">
          TypeHero provides a curated collection of diverse coding challenges grouped into different
          tracks, offering a dynamic learning path for developers to enhance their skills.
        </p>
      </div>
      {session ? (
        <EnrolledTrackSection
          key="enrolled-track-section"
          title="Your Tracks"
          tracks={enrolledTracks}
        />
      ) : null}
      <PopularTrackSection
        key="popular-track-section"
        title="Popular"
        tag="POPULAR"
        tracks={tracks}
      />
    </div>
  );
}

export type EnrolledTracks = Awaited<ReturnType<typeof getUserEnrolledTracks>>;

/**
 * Fetches user enrolled tracks based on current session.
 */
function getUserEnrolledTracks(session: Session | null) {
  return prisma.track.findMany({
    where: {
      enrolledUsers: {
        some: {
          id: session?.user.id,
        },
      },
    },
    include: {
      trackChallenges: {
        include: {
          challenge: {
            include: {
              submission: {
                where: {
                  userId: session?.user.id,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          enrolledUsers: true,
        },
      },
    },
    orderBy: {
      title: 'asc',
    },
  });
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

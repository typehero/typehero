import { getServerAuthSession, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { withUnstableCache } from '~/utils/withUnstableCache';
import { EnrolledTrackSectionCarousel } from './track-enrolled-section-carousel';
import { SkeletonTrack } from './SkeletonTrack';
import { createEnrolledTrackCacheKey } from './track.action';

export async function EnrolledTrackSection() {
  const session = await getServerAuthSession();

  if (!session) {
    return null;
  }

  const tracks = await withUnstableCache({
    fn: getUserEnrolledTracks,
    args: [session],
    keys: [createEnrolledTrackCacheKey(session.user.id)],
    tags: [createEnrolledTrackCacheKey(session.user.id)],
  });

  return (
    <div className="sm:px-8 md:px-0">
      {tracks.length > 0 ? (
        <>
          <div className="container p-4">
            <h2 className="relative text-3xl font-bold tracking-tight">
              <div className="absolute -left-8 -z-10 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
              Your Tracks
            </h2>
          </div>

          <section className="relative flex w-full flex-row gap-4 overflow-hidden rounded-[2.5rem]">
            <EnrolledTrackSectionCarousel tracks={tracks} />
          </section>
        </>
      ) : (
        <>
          <div className="container p-4">
            <h2 className="relative text-3xl font-bold tracking-tight">Your Tracks</h2>
          </div>
          <div
            className="relative grid min-h-[246px] w-full items-center gap-2 px-5  md:grid-cols-2 md:gap-10"
            key="helper-track"
          >
            <div className="text-center md:text-right">
              <h1 className="text-lg font-bold">You're not enrolled in any tracks yet.</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Start your journey by enrolling in a track below.
              </p>
            </div>

            <div className="absolute left-2/4 hidden h-full w-[1px] -translate-x-2/4 transform bg-white bg-opacity-5 md:block" />

            <div className="row-start-1 md:row-auto">
              <SkeletonTrack />
              <SkeletonTrack className="bg-opacity-[.01 -translate-y-4 translate-x-10" />
              <div className="absolute top-1/3 -z-10 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export type EnrolledTracks = Awaited<ReturnType<typeof getUserEnrolledTracks>>;

/**
 * Fetches user enrolled tracks based on current session.
 */
async function getUserEnrolledTracks(session: Session) {
  return prisma.track.findMany({
    where: {
      enrolledUsers: {
        some: {
          id: session.user.id,
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
                  userId: session.user.id,
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
      name: 'asc',
    },
  });
}

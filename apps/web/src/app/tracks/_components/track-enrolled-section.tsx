import { type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { auth } from '~/server/auth';
import { SkeletonTrack } from './SkeletonTrack';
import { EnrolledTrackSectionCarousel } from './track-enrolled-section-carousel';

export async function EnrolledTrackSection() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const tracks = await getUserEnrolledTracks(session);

  return (
    <div className="sm:px-8 md:px-0">
      {tracks.length > 0 ? (
        <>
          <div className="container p-4">
            <h2 className="relative font-bold text-3xl tracking-tight">
              <div className="-left-8 -z-10 absolute h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
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
            <h2 className="relative font-bold text-3xl tracking-tight">Your Tracks</h2>
          </div>
          <div
            className="relative grid min-h-[246px] w-full items-center gap-2 px-5 md:grid-cols-2 md:gap-10"
            key="helper-track"
          >
            <div className="text-center md:text-right">
              <h1 className="font-bold text-lg">You're not enrolled in any tracks yet.</h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Start your journey by enrolling in a track below.
              </p>
            </div>

            <div className="-translate-x-2/4 absolute left-2/4 hidden h-full w-[1px] transform bg-white bg-opacity-5 md:block" />

            <div className="row-start-1 md:row-auto">
              <SkeletonTrack />
              <SkeletonTrack className="-translate-y-4 translate-x-10 bg-opacity-[.01" />
              <div className="-z-10 absolute top-1/3 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
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
          id: session.user?.id,
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
                  userId: session.user?.id,
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

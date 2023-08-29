import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import Link from 'next/link';
import { Carousel } from '~/components/ui/carousel';
import { PersonalTrackCard } from './personal-track-card';

export async function EnrolledTrackSection() {
  const tracks = await getUserEnrolledTracks();
  return (
    <div>
      <div className="container flex items-center justify-between gap-3 px-4 pt-5">
        <h2 className="relative text-3xl font-bold tracking-tight">
          <div className="absolute -left-8 -z-10 h-12 w-32 rounded-full bg-blue-300/50 blur-3xl" />
          Your Tracks
        </h2>
      </div>
      <section className="relative flex w-full flex-row gap-4 overflow-hidden rounded-[2.5rem]">
        <Carousel>
          {tracks.map((t) => (
            <Link
              className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
              href={`/tracks/${t.id}`}
              key={t.id}
            >
              <PersonalTrackCard track={t} />
            </Link>
          ))}
          {tracks.length == 0 && (
            <div className="w-full items-center" key="helper-track">
              <div className="flex h-[30vh] flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">No Tracks Yet.</h1>
                <p className="text-xl">Start your journey by enrolling in a track.</p>
              </div>
            </div>
          )}
        </Carousel>
      </section>
    </div>
  );
}

export type EnrolledTracks = Awaited<ReturnType<typeof getUserEnrolledTracks>>;

/**
 * Fetches user enrolled tracks based on current session.
 */
async function getUserEnrolledTracks() {
  const session = await getServerAuthSession();
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

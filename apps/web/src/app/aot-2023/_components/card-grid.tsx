import { type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { auth } from '~/server/auth';
import { daysAfterDecemberFirst } from '~/utils/aot';
import { TiltableCard } from './tiltable-card';

export async function CardGrid() {
  const session = await auth();
  const challenges = await getTrackChallenges(session);
  const challengesToReveal = revealItems(challenges);

  return (
    <div className="container">
      <section className="+ 8rem)] md:-mx-16 grid w-[calc(100% grid-cols-[repeat(1,240px)] justify-center gap-4 sm:px-8 md:grid-cols-[repeat(3,240px)] md:px-0 lg:mx-0 lg:w-full xl:grid-cols-[repeat(4,240px)] 2xl:gap-8">
        {challengesToReveal?.map((challenge, i) => {
          return <TiltableCard key={challenge.id} index={i} challenge={challenge} />;
        })}
      </section>
    </div>
  );
}

export type Challenges = NonNullable<Awaited<ReturnType<typeof getTrackChallenges>>>;
async function getTrackChallenges(session: Session | null) {
  const track = await prisma.track.findFirstOrThrow({
    where: {
      slug: 'advent-of-typescript-2023',
    },
    include: {
      trackChallenges: {
        include: {
          challenge: {
            select: {
              submission: {
                where: {
                  userId: session?.user?.id || '',
                  isSuccessful: true,
                },
                select: {
                  isSuccessful: true,
                },
                take: 1,
              },
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          orderId: 'asc',
        },
      },
    },
  });

  return track?.trackChallenges.map((trackChallenge) => {
    const { submission, ...challenge } = trackChallenge.challenge;
    return {
      ...challenge,
      hasSolved: trackChallenge.challenge.submission.length > 0,
    };
  });
}

function revealItems(items: Challenges) {
  const daysPassed = daysAfterDecemberFirst();

  return items.map((item, index) => {
    const isPastOrCurrentDay = index <= daysPassed;
    return { ...item, isRevealed: isPastOrCurrentDay };
  });
}

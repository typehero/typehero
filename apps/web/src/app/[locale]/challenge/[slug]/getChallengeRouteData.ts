import { type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { cache } from 'react';
import { getAllFlags } from '~/utils/feature-flags';
import { validateCompilerOptions } from '~/utils/validateCompilerOptions';

export type ChallengeRouteData = NonNullable<Awaited<ReturnType<typeof getChallengeRouteData>>>;

// this is to data to populate the description tab (default tab on challenge page)
export const getChallengeRouteData = cache(async (slug: string, session: Session | null) => {
  const featureFlags = await getAllFlags();

  const challenge = await prisma.challenge.findFirstOrThrow({
    where: {
      slug,
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          vote: true,
        },
      },
      vote: {
        where: {
          userId: session?.user?.id || '',
        },
      },
      bookmark: {
        where: {
          userId: session?.user?.id || '',
        },
      },
      submission: {
        where: {
          userId: session?.user?.id || '',
          isSuccessful: true,
        },
        take: 1,
      },
    },
  });

  const tsconfig = challenge.tsconfig;
  if (!validateCompilerOptions(tsconfig)) {
    throw new Error(`Challenge "${challenge.slug}" has an invalid tsconfig`);
  }

  /**
   * Select the first track that the user is enrolled in for this challenge.
   */
  const track =
    featureFlags?.enableInChallengeTrack && session
      ? await prisma.track.findFirst({
          where: {
            trackChallenges: {
              some: {
                challengeId: challenge.id,
                track: {
                  enrolledUsers: {
                    some: {
                      id: session.user?.id,
                    },
                  },
                },
              },
            },
          },
        })
      : null;

  return {
    challenge: {
      ...challenge,
      hasSolved: challenge.submission.length > 0,
      tsconfig,
    },
    track,
  };
});

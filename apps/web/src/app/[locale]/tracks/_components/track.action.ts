'use server';

import { auth, type Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import { cache } from 'react';
import { track } from '@vercel/analytics/server';

export const createTrackGridCacheKey = (userId: string) => `user-${userId}-tracks`;

/**
 * Enrolls the session user in the track given a track id.
 * @param id The track id.
 */
export async function enrollUserInTrack(id: number, slug: string) {
  const session = await auth();
  if (!session) {
    throw new Error('User is not logged in');
  }

  await prisma.track.update({
    where: {
      id,
    },
    data: {
      enrolledUsers: {
        connect: {
          id: session?.user.id,
        },
      },
    },
  });

  track?.('track-action', { action: 'enrolled', slug });
  revalidateTag(`track-${id}-detail`);
  revalidateTag(createTrackGridCacheKey(session.user.id));
}

/**
 * Un-enrolls the session user in the track given a track id.
 * @param id The track id.
 */
export async function unenrollUserFromTrack(id: number, slug: string) {
  const session = await auth();
  if (!session) {
    throw new Error('User is not logged in');
  }

  await prisma.track.update({
    where: {
      id,
    },
    data: {
      enrolledUsers: {
        disconnect: {
          id: session?.user.id,
        },
      },
    },
  });

  track?.('track-action', { action: 'unenrolled', slug });
  revalidateTag(`track-${id}-detail`);
  revalidateTag(createTrackGridCacheKey(session.user.id));
}

/**
 * Fetches the track details given a track id.
 * @param id The track id.
 */
export const getTrackDetails = cache(async (slug: string) => {
  const session = await auth();
  return prisma.track.findFirstOrThrow({
    where: {
      slug,
    },
    include: {
      trackChallenges: {
        orderBy: {
          orderId: 'asc',
        },
        include: {
          challenge: {
            include: {
              submission: {
                where: {
                  userId: session?.user.id ?? '',
                },
              },
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      enrolledUsers: {
        where: {
          id: session?.user.id ?? '',
        },
        select: {
          id: true,
        },
      },
    },
  });
});

export type EnrolledTracks = Awaited<ReturnType<typeof getUserEnrolledTracks>>;

/**
 * Fetches user enrolled tracks based on current session.
 */
export async function getUserEnrolledTracks(session: Session) {
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

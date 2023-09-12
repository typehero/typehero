'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { cache } from 'react';

/**
 * Enrolls the session user in the track given a track id.
 * @param id The track id.
 */
export async function enrollUserInTrack(id: number) {
  const session = await getServerAuthSession();
  return prisma.track.update({
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
}

/**
 * Un-enrolls the session user in the track given a track id.
 * @param id The track id.
 */
export async function unenrollUserFromTrack(id: number) {
  const session = await getServerAuthSession();
  return prisma.track.update({
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
}

/**
 * Fetches the track details given a track id.
 * @param id The track id.
 */
export const getTrackDetails = cache(async (id: number) => {
  const session = await getServerAuthSession();

  return prisma.track.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          enrolledUsers: true,
        },
      },
      trackChallenges: true,
      enrolledUsers: {
        where: {
          id: session?.user.id,
        },
        select: {
          id: true,
        },
      },
    },
  });
});

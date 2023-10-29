'use server';

import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { revalidateTag } from 'next/cache';
import { cache } from 'react';
import { createEnrolledTrackCacheKey } from './track-enrolled-section';
import { createTrackGridCacheKey } from './track-grid';

/**
 * Enrolls the session user in the track given a track id.
 * @param id The track id.
 */
export async function enrollUserInTrack(id: number) {
  const session = await getServerAuthSession();
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

  revalidateTag(`track-${id}-detail`);
  revalidateTag(createTrackGridCacheKey(session.user.id));
  revalidateTag(createEnrolledTrackCacheKey(session.user.id));
}

/**
 * Un-enrolls the session user in the track given a track id.
 * @param id The track id.
 */
export async function unenrollUserFromTrack(id: number) {
  const session = await getServerAuthSession();
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

  revalidateTag(`track-${id}-detail`);
  revalidateTag(createTrackGridCacheKey(session.user.id));
  revalidateTag(createEnrolledTrackCacheKey(session.user.id));
}

/**
 * Fetches the track details given a track id.
 * @param id The track id.
 */
export const getTrackDetails = cache(async (slug: string) => {
  const session = await getServerAuthSession();
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

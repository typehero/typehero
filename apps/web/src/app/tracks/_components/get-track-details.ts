import { prisma } from '@repo/db';
import { cache } from 'react';

/**
 * Fetches a track with its challenges, plus the given user's submissions on them and
 * whether they're enrolled. Resolves to `null` when there's no track with that slug. Used by the track pages directly and by `track.getDetails`
 * for client components, so it deliberately isn't a server action.
 */
export const getTrackDetails = cache(async (slug: string, userId?: string) => {
  return prisma.track.findFirst({
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
                  userId: userId ?? '',
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
          id: userId ?? '',
        },
        select: {
          id: true,
        },
      },
    },
  });
});

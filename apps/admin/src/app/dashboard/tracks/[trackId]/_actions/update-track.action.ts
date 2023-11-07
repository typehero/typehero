'use server';

import { prisma } from '@repo/db';
import type { FormSchema } from '../_components/update-track-form';

export async function updateTrack(data: FormSchema & { trackId: number }) {
  const { trackId, trackChallenges, ...rest } = data;
  await prisma.trackChallenge.deleteMany({
    where: { trackId },
  });
  await prisma.track.update({
    where: { id: trackId },
    data: {
      ...rest,
      trackChallenges: {
        createMany: {
          data: trackChallenges.map((tc) => {
            const { challenge, ...rest } = tc;
            return { ...rest };
          }),
        },
      },
    },
  });
}

'use server';

import { prisma } from '@repo/db';
import type { FormSchema } from '../_components/update-track-form';

export async function updateTrack(data: FormSchema & { trackId: number }) {
  const { trackId, ...rest } = data;
  await prisma.$transaction([
    prisma.track.update({
      where: { id: trackId },
      data: {
        trackChallenges: {
          set: [],
        },
      },
    }),
    prisma.track.update({
      where: { id: trackId },
      data: {
        ...rest,
        trackChallenges: {
          createMany: {
            data: data.trackChallenges.map((tc) => {
              const { challenge, ...rest } = tc;
              return { ...rest };
            }),
          },
        },
      },
    }),
  ]);
}

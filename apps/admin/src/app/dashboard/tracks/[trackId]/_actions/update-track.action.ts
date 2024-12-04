'use server';

import { auth } from '~/server/auth';
import { prisma } from '@repo/db';
import { assertAdmin } from '~/utils/auth-guards';
import type { FormSchema } from '../_components/update-track-form';

export async function updateTrack(data: FormSchema & { trackId: number }) {
  const session = await auth();
  assertAdmin(session);

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
            const { challenge: _, ...rest } = tc;
            return { ...rest };
          }),
        },
      },
    },
  });
}

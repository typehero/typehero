'use server';

import { prisma } from '@repo/db';
import type { Prisma } from '@repo/db/types';

export async function getTracks() {
  return prisma.track.findMany({
    include: {
      trackChallenges: true,
    },
  });
}

export async function createTrack(data: Prisma.TrackCreateInput) {
  const { trackChallenges, ...rest } = data;
  return prisma.track.create({
    data: {
      ...rest,
    },
  });
}

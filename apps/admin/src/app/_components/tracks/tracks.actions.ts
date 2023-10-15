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

export async function createTrack(data: Omit<Prisma.TrackCreateInput, 'slug'>) {
  const { trackChallenges, ...rest } = data;
  const slug = rest.name.toLowerCase().replace(/\s/g, '-');
  return prisma.track.create({
    data: {
      ...rest,
      slug,
    },
  });
}

'use server';

import { prisma } from '@repo/db';
import type { Prisma } from '@repo/db/types';

export async function getTracks() {
  console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  const tracks = await prisma.track.findMany({
    include: {
      trackChallenges: true,
    },
  });

  console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  console.log({ tracks });
  console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  return tracks;
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

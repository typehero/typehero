'use server';

import { auth } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { type Prisma } from '@repo/db/types';
import { assertAdmin } from '~/utils/auth-guards';

export async function getTracks() {
  const tracks = await prisma.track.findMany({
    include: {
      trackChallenges: true,
    },
  });

  return tracks;
}

export async function createTrack(data: Omit<Prisma.TrackCreateInput, 'slug'>) {
  const session = await auth();
  assertAdmin(session);

  const { trackChallenges, ...rest } = data;
  const slug = rest.name.toLowerCase().replace(/\s/g, '-');
  return prisma.track.create({
    data: {
      ...rest,
      slug,
    },
  });
}

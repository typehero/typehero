'use server';

import { prisma } from '@repo/db';
import { Prisma } from '@repo/db/types';

export async function getTracks({ page, size }: { page: number; size: number }) {
  const [count, data] = await prisma.$transaction([
    prisma.track.count(),
    prisma.track.findMany({
      skip: page * size,
      take: size,
    }),
  ]);

  const pageCount = Math.ceil(count / size);

  return [pageCount, data];
}

export async function createTrack(data: Prisma.TrackCreateInput) {
  const { trackChallenges, ...rest } = data;
  return prisma.track.create({
    data: {
      ...rest,
    },
  });
}

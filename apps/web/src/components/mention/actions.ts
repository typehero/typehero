'use server';

import { prisma } from '@repo/db';

export async function searchUsers(query: string) {
  if (query.length > 39) {
    throw new Error('Query limited to 39 characters');
  }

  return prisma.user.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    orderBy: {
      name: 'desc',
    },
    take: 10,
  });
}

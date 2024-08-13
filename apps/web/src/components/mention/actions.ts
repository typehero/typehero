'use server';

import { prisma } from '@repo/db';

export async function searchUsers(query: string) {
  return prisma.user.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    orderBy: {
      name: 'desc',
    },
    take: 10,
  });
}

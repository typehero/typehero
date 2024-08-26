'use server';

import { auth } from '~/server/auth';
import { prisma } from '@repo/db';

export async function markNotificationsAsRead(ids: number[]) {
  const session = await auth();

  if (!session) {
    throw new Error('User not authenticated');
  }

  await prisma.notification.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      isRead: true,
    },
  });
}

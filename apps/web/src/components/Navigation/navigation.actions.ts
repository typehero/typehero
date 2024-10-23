'use server';

import { prisma } from '@repo/db';
import { auth } from '~/server/auth';

export async function getNotificationCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;
  return prisma.notification.count({
    where: {
      isRead: false,
      toUserId: session?.user.id || '',
    },
  });
}

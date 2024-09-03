'use server';

import { prisma } from '@repo/db';
import { auth } from '~/server/auth';

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

export type Notification = Awaited<ReturnType<typeof getNotifications>>['notifications'][0];
export type GetNotificationsResponse = Awaited<ReturnType<typeof getNotifications>>;

/**
 * Fetches user enrolled tracks based on current session.
 */
export async function getNotifications({
  cursor,
  mentionsOnly = false,
}: {
  cursor?: number;
  mentionsOnly?: boolean;
}) {
  const session = await auth();
  if (!session) {
    throw new Error('not authenticated');
  }

  const notifications = await prisma.notification.findMany({
    take: 5,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      toUserId: session.user.id,
      type: mentionsOnly ? 'MENTION' : undefined,
    },
    select: {
      id: true,
      blurb: true,
      createdAt: true,
      url: true,
      comment: {
        select: {
          id: true,
          rootType: true,
          text: true,
        },
      },
      isRead: true,
      content: true,
      fromUser: {
        select: {
          image: true,
          name: true,
        },
      },
      type: true,
    },
    orderBy: [
      {
        isRead: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return { notifications, cursor: notifications.at(-1)?.id };
}

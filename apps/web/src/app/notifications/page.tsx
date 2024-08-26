import type { Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { Metadata } from 'next';
import { auth } from '~/server/auth';
import NotificationPage from './notification-page';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default async function Page() {
  const session = await auth();

  if (!session) {
    throw new Error('not authed');
  }

  const notifications = await getNotifications(session);

  return <NotificationPage notifications={notifications} />;
}

export type Notification = Awaited<ReturnType<typeof getNotifications>>[0];

/**
 * Fetches user enrolled tracks based on current session.
 */
async function getNotifications(session: Session) {
  return prisma.notification.findMany({
    where: {
      toUserId: session.user.id,
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
          rootChallenge: {
            select: {
              slug: true,
            },
          },
          rootSolution: {
            select: {
              id: true,
              challenge: {
                select: { slug: true },
              },
            },
          },
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
    orderBy: {
      createdAt: 'desc',
    },
  });
}

import type { Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { AlertCircle, AtSign, Bell } from '@repo/ui/icons';
import type { Metadata } from 'next';
import { auth } from '~/server/auth';
import { NotificationItem } from './notfication-item';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    throw new Error('not authed');
  }

  const notifications = await getNotifications(session);
  const mentionNotifications = notifications.filter((n) => n.type === 'MENTION');

  const EmptyState = ({ type }: { type: 'all' | 'mentions' }) => (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      {type === 'all' ? (
        <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
      ) : (
        <AtSign className="text-muted-foreground mb-4 h-12 w-12" />
      )}
      <h3 className="text-foreground mb-2 text-lg font-semibold">
        {type === 'all' ? 'No notifications yet' : 'No mentions yet'}
      </h3>
      <p className="text-muted-foreground max-w-sm text-sm">
        {type === 'all'
          ? "When you get notifications, they'll show up here. Start by engaging with others in the comments."
          : "When someone mentions you in a comment, you'll see it here"}
      </p>
    </div>
  );

  return (
    <div className="bg-background mx-auto min-w-[300px] max-w-3xl rounded-lg ">
      <div className="p-4">
        <h2 className="text-foreground flex items-center text-xl font-bold">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
        </h2>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted grid w-full grid-cols-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="border-border border">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <EmptyState type="all" />
          )}
        </TabsContent>
        <TabsContent value="mentions">
          {mentionNotifications.length > 0 ? (
            mentionNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <EmptyState type="mentions" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
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

import type { Session } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { NotificationType } from '@repo/db/types';
import { Markdown } from '@repo/ui/components/markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { AlertCircle, AtSign, Bell, Heart, MessageCircle, ShieldAlert } from '@repo/ui/icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '~/server/auth';
import { getRelativeTime } from '~/utils/relativeTime';

export const metadata: Metadata = {
  title: 'Notifications',
};

const BLURBS = {
  MENTION: 'mentioned you in a comment',
  LIKE: (type: string) => `liked your ${type}`,
  SYSTEM: '',
  MISC: '',
  REPLY: 'replied to you',
} satisfies Record<NotificationType, string | ((v: string) => string)>;

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    throw new Error('not authed');
  }

  const notifications = await getNotifications(session);
  const mentionNotifications = notifications.filter((n) => n.type === 'MENTION');

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
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </TabsContent>
        <TabsContent value="mentions">
          {mentionNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const getBlurb = (notification: Notification) => {
    if (notification.type === 'LIKE') {
      const type = notification.comment ? 'comment' : 'solution';
      return BLURBS.LIKE(type);
    }

    return BLURBS[notification.type];
  };

  return (
    <Link
      href={notification.url}
      className="border-border flex flex-col space-y-2 border-b p-4 last:border-b-0"
      tabIndex={0}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {notification.type === 'LIKE' && (
            <Heart className="h-5 w-5 text-red-500  dark:text-red-400" />
          )}
          {notification.type === 'MENTION' && (
            <AtSign className="h-5 w-5 text-blue-500  dark:text-blue-400" />
          )}
          {notification.type === 'REPLY' && (
            <MessageCircle className="h-5 w-5 text-purple-500  dark:text-purple-400" />
          )}
          {notification.type === 'MISC' && (
            <AlertCircle className="h-5 w-5 text-orange-500  dark:text-orange-400" />
          )}
          {notification.type === 'SYSTEM' && (
            <ShieldAlert className="h-5 w-5 text-yellow-500  dark:text-yellow-400" />
          )}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium">{notification.fromUser.name}</p>
          <p className="text-sm text-gray-500">{notification.blurb ?? getBlurb(notification)}</p>
        </div>
        <div className="flex-shrink-0 text-xs text-gray-400">
          {getRelativeTime(notification.createdAt)}
        </div>
      </div>
      {notification.type === 'MENTION' ||
      notification.type === 'REPLY' ||
      notification.type === 'LIKE'
        ? // if a user edits the comment and deletes the contents just hide it
          notification.comment?.text && (
            <div className="bg-muted text-foreground ml-9 mt-1 overflow-hidden rounded-md p-3 text-sm">
              <Markdown disableMentions className="ml-9 mt-1 rounded-md">
                {notification.comment.text}
              </Markdown>
            </div>
          )
        : null}
    </Link>
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

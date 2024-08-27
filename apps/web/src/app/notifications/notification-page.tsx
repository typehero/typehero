'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { AlertCircle, AtSign, Bell } from '@repo/ui/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { NOTIFICATION_QUERY_KEY } from '~/components/Navigation/notification-link';
import { NotificationItem } from './notfication-item';
import { markNotificationsAsRead } from './notification.actions';
import type { Notification } from './page';

export default function NotificationPage({ notifications }: { notifications: Notification[] }) {
  const seenNotifications = useRef(new Set<number>());
  const timeoutRef = useRef<number>();
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess() {},
  });

  const mentionNotifications = notifications.filter((n) => n.type === 'MENTION');

  const onSeen = (id: number) => {
    seenNotifications.current.add(id);
    const copy = new Set(seenNotifications.current);
    copy.add(id);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = undefined;
      mutation.mutate(Array.from(seenNotifications.current), {
        onSuccess: () => {
          for (const id of copy) {
            seenNotifications.current.delete(id);
          }
        },
      });
      client.setQueryData([NOTIFICATION_QUERY_KEY], 0);
    }, 500);
  };

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
              <NotificationItem key={notification.id} notification={notification} onSeen={onSeen} />
            ))
          ) : (
            <EmptyState type="all" />
          )}
        </TabsContent>
        <TabsContent value="mentions" className="border-border border">
          {mentionNotifications.length > 0 ? (
            mentionNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onSeen={onSeen} />
            ))
          ) : (
            <EmptyState type="mentions" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

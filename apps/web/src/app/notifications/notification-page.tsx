'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { Bell } from '@repo/ui/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { NOTIFICATION_QUERY_KEY } from '~/components/Navigation/notification-link';
import { markNotificationsAsRead } from './notification.actions';
import { NotificationsAll } from './notifications-all';
import { NotificationsMentions } from './notifications-mentions';

export default function NotificationPage() {
  const seenNotifications = useRef(new Set<number>());
  const timeoutRef = useRef<number>();
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess() {},
  });

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
          <NotificationsAll onSeen={onSeen} />
        </TabsContent>
        <TabsContent value="mentions" className="border-border border">
          <NotificationsMentions onSeen={onSeen} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

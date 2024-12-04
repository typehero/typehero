'use client';

import { Bell } from '@repo/ui/icons';
import { track } from '@vercel/analytics';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { getNotificationCount } from './navigation.actions';

export const NOTIFICATION_QUERY_KEY = 'notificationCounts';
export function NotificationLink({ notificationCount }: { notificationCount: number }) {
  // eventually lift this higher and pull new data and insert new rows into the notifications
  // view if user is currently looking at it (example: twitter notif view)
  const { data: count } = useQuery({
    initialData: notificationCount,
    queryKey: [NOTIFICATION_QUERY_KEY],
    queryFn: () => getNotificationCount(),
    refetchInterval: 60000, // one minute
  });

  return (
    <Link
      onClick={() => {
        track('notifications');
      }}
      className="ml-2"
      aria-label="notification page link"
      href={{
        pathname: '/notifications',
      }}
    >
      <div className="relative flex items-center space-x-2">
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span
            className={clsx(
              "absolute right-[2%] top-[4%] grid min-h-[18px] min-w-[18px] -translate-y-2/4 translate-x-2/4 place-items-center rounded-full bg-red-500 text-xs font-medium leading-none text-white content-['']",
              count > 9 && 'w-7',
              count > 20 && 'w-8',
            )}
          >
            {count > 20 ? `20+` : count}
          </span>
        )}
      </div>
    </Link>
  );
}

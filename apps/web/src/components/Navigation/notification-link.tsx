'use client';

import { Bell } from '@repo/ui/icons';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { getNotificationCount } from './navigation.actions';

export function NotificationLink({ notificationCount }: { notificationCount: number }) {
  const { data: count } = useQuery({
    initialData: notificationCount,
    queryKey: ['notificationCounts'],
    queryFn: () => getNotificationCount(),
    refetchInterval: 60000, // one minute
  });

  return (
    <Link
      className=""
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
            {count > 20 ? `${count}+` : count}
          </span>
        )}
      </div>
    </Link>
  );
}

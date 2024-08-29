'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import InfiniteList from '~/components/infinite-list';
import { Empty } from './empty';
import { NotificationItem } from './notfication-item';
import { getNotifications } from './notification.actions';

export function NotificationsMentions({ onSeen }: { onSeen: (v: number) => void }) {
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['notifications-mentions'],
    queryFn: ({ pageParam }) => {
      return getNotifications({ cursor: pageParam, mentionsOnly: true });
    },
    getNextPageParam: (lastPage) => lastPage?.cursor,
  });

  if (isLoading) {
    return null;
  }

  if (data?.pages[0]?.notifications.length === 0) {
    return <Empty type="mentions" />;
  }

  return (
    <>
      <InfiniteList
        isLoadingNext={isFetchingNextPage}
        loader={<div>loading...</div>}
        hasNext={hasNextPage}
        next={fetchNextPage}
        key="mentions"
      >
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onSeen={onSeen} />
            ))}
          </Fragment>
        ))}
      </InfiniteList>
    </>
  );
}

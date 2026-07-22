'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import InfiniteList from '~/components/infinite-list';
import { useTRPC } from '~/trpc/react';
import { Empty } from './empty';
import { NotificationItem } from './notfication-item';

export function NotificationsMentions({ onSeen }: { onSeen: (v: number) => void }) {
  const trpc = useTRPC();
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } = useInfiniteQuery(
    trpc.notification.getNotifications.infiniteQueryOptions(
      { mentionsOnly: true },
      {
        initialCursor: 0,
        getNextPageParam: (lastPage) => lastPage?.cursor,
      },
    ),
  );

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

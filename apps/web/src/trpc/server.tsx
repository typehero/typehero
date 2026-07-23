import 'server-only';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createTRPCOptionsProxy, type TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { headers } from 'next/headers';
import { cache } from 'react';

import { appRouter, createCaller } from '~/server/api/root';
import { createTRPCContext } from '~/server/api/trpc';
import { createQueryClient } from './query-client';

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
  });
});

/**
 * IMPORTANT: Create a stable getter for the query client that will return the same client during
 * the same request.
 */
export const getQueryClient = cache(createQueryClient);

/**
 * Direct server caller for reading data in Server Components.
 *
 * This is detached from the React Query cache — use `trpc` + `prefetch` when you need to hydrate
 * data into Client Components.
 *
 * @see https://trpc.io/docs/client/nextjs/server-components#getting-data-in-a-server-component
 */
export const api = createCaller(createContext);

/**
 * Options proxy for prefetching queries into the per-request QueryClient.
 *
 * @see https://trpc.io/docs/client/tanstack-react-query/server-components
 */
export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch(queryOptions: ReturnType<TRPCQueryOptions<any>>) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

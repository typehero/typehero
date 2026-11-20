import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { bookmarkRouter } from './routers/bookmark';
import { notificationRouter } from './routers/notification';
import { submissionRouter } from './routers/submission';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bookmark: bookmarkRouter,
  notification: notificationRouter,
  submission: submissionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.notification.getUnreadCount();
 */
export const createCaller = createCallerFactory(appRouter);

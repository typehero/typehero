import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { bookmarkRouter } from './routers/bookmark';
import { challengeRouter } from './routers/challenge';
import { commentRouter } from './routers/comment';
import { notificationRouter } from './routers/notification';
import { reportRouter } from './routers/report';
import { userRouter } from './routers/user';
import { shortUrlRouter } from './routers/short-url';
import { voteRouter } from './routers/vote';
import { solutionRouter } from './routers/solution';
import { submissionRouter } from './routers/submission';
import { trackRouter } from './routers/track';
import { profileRouter } from './routers/profile';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bookmark: bookmarkRouter,
  challenge: challengeRouter,
  comment: commentRouter,
  notification: notificationRouter,
  report: reportRouter,
  user: userRouter,
  shortUrl: shortUrlRouter,
  vote: voteRouter,
  solution: solutionRouter,
  submission: submissionRouter,
  track: trackRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 *
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.notification.getUnreadCount();
 */
export const createCaller = createCallerFactory(appRouter);

import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';

export type Challenge = inferRouterOutputs<AppRouter>['event']['getEventChallengeBySlug'];

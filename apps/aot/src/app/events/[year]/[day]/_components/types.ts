import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/trpc/types';

export type Challenge = inferRouterOutputs<AppRouter>['event']['getEventChallengeBySlug'];

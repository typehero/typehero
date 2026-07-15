import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/trpc/router-type';

export type Challenge = inferRouterOutputs<AppRouter>['event']['getEventChallengeBySlug'];

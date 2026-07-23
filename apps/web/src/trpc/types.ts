import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '~/server/api/root';

export type { AppRouter };

/**
 * Inference helper for inputs.
 *
 * @example type NotificationsInput = RouterInputs['notification']['getNotifications']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type NotificationsOutput = RouterOutputs['notification']['getNotifications']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

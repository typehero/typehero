import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '~/server/api/root';

export type { AppRouter };

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

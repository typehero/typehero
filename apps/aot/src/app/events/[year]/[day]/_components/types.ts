import type { RouterOutputs } from '~/trpc/types';

export type Challenge = RouterOutputs['event']['getEventChallengeBySlug'];

import { TRPCError } from '@trpc/server';

import { createChallengeSchema } from '~/app/wizard/_components/schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const challengeRouter = createTRPCRouter({
  /**
   * Submits a challenge from the creation wizard.
   *
   * The author is the session user, the slug is derived from the name, and whether the
   * challenge goes live straight away depends on the author's roles as stored in the
   * session, not on anything the client says. Everyone else's challenges start PENDING
   * and wait for review.
   */
  create: protectedProcedure.input(createChallengeSchema).mutation(async ({ ctx, input }) => {
    const isCreator = ctx.session.user.role.includes('CREATOR');

    try {
      const challenge = await ctx.db.challenge.create({
        data: {
          name: input.name,
          slug: input.name.toLowerCase().replace(/ /g, '-'),
          shortDescription: input.shortDescription,
          difficulty: input.difficulty,
          description: input.description,
          tests: input.tests,
          code: input.code,
          userId: ctx.session.user.id,
          status: isCreator ? 'ACTIVE' : 'PENDING',
        },
        select: { id: true, slug: true, status: true },
      });
      return challenge;
    } catch (error) {
      // `name` and `slug` are both unique, so a taken name (or one that slugs to a taken
      // slug) surfaces as a unique-constraint violation.
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A challenge with this name already exists',
        });
      }
      throw error;
    }
  }),
});

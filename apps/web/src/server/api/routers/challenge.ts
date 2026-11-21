import { TRPCError } from '@trpc/server';

import { createChallengeSchema } from '~/app/wizard/_components/schema';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const challengeRouter = createTRPCRouter({
  /**
   * "More challenges" suggestions for a challenge page.
   *
   * Picks active challenges of the same difficulty, leaving out the current one and, for a
   * signed-in user, the ones they already solved. If that leaves nothing, any unsolved
   * active challenge is suggested instead.
   */
  similar: publicProcedure
    .input(
      z.object({
        challengeId: z.number().int(),
        maxChallenges: z.number().int().min(1).max(10).default(2),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { challengeId, maxChallenges } = input;

      const current = await ctx.db.challenge.findUnique({
        where: { id: challengeId },
        select: { difficulty: true },
      });
      if (!current) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Challenge not found' });
      }

      const userId = ctx.session?.user?.id;
      const solved = userId
        ? await ctx.db.submission.findMany({
            where: { userId, isSuccessful: true },
            select: { challengeId: true },
            distinct: ['challengeId'],
          })
        : [];
      const excludedIds = [challengeId, ...solved.map((submission) => submission.challengeId)];

      const sameDifficulty = await ctx.db.challenge.findMany({
        where: {
          status: 'ACTIVE',
          difficulty: current.difficulty,
          id: { notIn: excludedIds },
        },
        take: maxChallenges,
      });
      if (sameDifficulty.length > 0 || !userId) return sameDifficulty;

      return ctx.db.challenge.findMany({
        where: { status: 'ACTIVE', id: { notIn: excludedIds } },
        take: maxChallenges,
      });
    }),

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

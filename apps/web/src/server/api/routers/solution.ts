import type { prisma } from '@repo/db';
import { TRPCError } from '@trpc/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import {
  createCacheKeyForSharedSolutionsTab,
  createCacheKeyForSolutions,
} from '~/app/challenge/[slug]/solutions/_components/solutions.helpers';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';

const title = z.string().min(5).max(191);
const description = z.string().min(30);

export const solutionRouter = createTRPCRouter({
  /**
   * Posts a solution to a challenge as the current user. The author is always the
   * session user and the cache tags are derived from the stored challenge.
   */
  create: protectedProcedure
    .input(z.object({ challengeId: z.number(), title, description }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.challenge.findUnique({
        where: { id: input.challengeId },
        select: { slug: true },
      });
      if (!challenge) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Challenge not found' });
      }

      const solution = await ctx.db.sharedSolution.create({
        data: {
          challengeId: input.challengeId,
          title: input.title,
          description: input.description,
          userId,
        },
        select: { id: true },
      });

      revalidateTag(createCacheKeyForSolutions(challenge.slug), 'max');
      revalidateTag(createCacheKeyForSharedSolutionsTab(userId), 'max');

      return solution;
    }),

  /**
   * Edits a solution's title and description. Only the author, an admin or a moderator can.
   */
  update: protectedProcedure
    .input(z.object({ id: z.number(), title, description }))
    .mutation(async ({ ctx, input }) => {
      const solution = await findSolutionOrThrow(ctx.db, input.id);
      assertCanModify(ctx.session, solution.userId, 'edit');

      await ctx.db.sharedSolution.update({
        where: { id: input.id },
        data: { title: input.title, description: input.description },
      });

      revalidateSolutionTags(solution);
    }),

  /**
   * Deletes a solution. Only the author, an admin or a moderator can.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const solution = await findSolutionOrThrow(ctx.db, input.id);
      assertCanModify(ctx.session, solution.userId, 'delete');

      await ctx.db.sharedSolution.delete({ where: { id: input.id } });

      revalidateSolutionTags(solution);
    }),

  /**
   * Pins or unpins a solution. Admins and moderators only.
   */
  setPinned: protectedProcedure
    .input(z.object({ id: z.number(), isPinned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!isAdminOrModerator(ctx.session)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not authorized to pin/unpin solutions',
        });
      }

      const solution = await findSolutionOrThrow(ctx.db, input.id);

      await ctx.db.sharedSolution.update({
        where: { id: input.id },
        data: { isPinned: input.isPinned },
      });

      revalidateSolutionTags(solution);
    }),
});

type Db = typeof prisma;

async function findSolutionOrThrow(db: Db, id: number) {
  const solution = await db.sharedSolution.findUnique({
    where: { id },
    select: { userId: true, challenge: { select: { slug: true } } },
  });
  if (!solution) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Solution not found' });
  }
  return solution;
}

function assertCanModify(
  session: Parameters<typeof isAuthor>[0],
  ownerId: string | null,
  action: 'delete' | 'edit',
) {
  if (!isAuthor(session, ownerId) && !isAdminOrModerator(session)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Not authorized to ${action} this solution.`,
    });
  }
}

function revalidateSolutionTags(solution: {
  userId: string | null;
  challenge: { slug: string } | null;
}) {
  revalidateTag(createCacheKeyForSolutions(solution.challenge?.slug ?? ''), 'max');
  if (solution.userId) {
    revalidateTag(createCacheKeyForSharedSolutionsTab(solution.userId), 'max');
  }
}

import type { prisma } from '@repo/db';
import { TRPCError } from '@trpc/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import {
  createCacheKeyForSharedSolutionsTab,
  createCacheKeyForSolutions,
} from '~/app/challenge/[slug]/solutions/_components/solutions.helpers';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { orderBy } from '~/utils/sorting';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';

const SOLUTIONS_PAGE_SIZE = 10;

const title = z.string().min(5).max(191);
const description = z.string().min(30);

export const solutionRouter = createTRPCRouter({
  /**
   * One page of a challenge's shared solutions, plus what the solutions tab needs to know
   * about the viewer: the challenge id and their latest passing submission (used to seed
   * the editor and to decide whether they may share a solution).
   */
  list: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1).max(191),
        page: z.number().int().min(1),
        sortKey: z.enum(['createdAt', 'vote', 'solutionComment']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { slug, page, sortKey, sortOrder } = input;
      const userId = ctx.session?.user?.id;

      const challenge = await ctx.db.challenge.findFirst({
        where: { slug },
        select: {
          id: true,
          _count: { select: { sharedSolution: true } },
          submission: userId
            ? {
                where: { userId, isSuccessful: true },
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { code: true },
              }
            : false,
          sharedSolution: {
            skip: (page - 1) * SOLUTIONS_PAGE_SIZE,
            take: SOLUTIONS_PAGE_SIZE,
            orderBy: [{ isPinned: 'desc' }, orderBy(sortKey, sortOrder)],
            include: {
              user: { select: { name: true, roles: true, image: true, bio: true } },
              _count: { select: { vote: true, solutionComment: true } },
            },
          },
        },
      });

      if (!challenge) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Challenge not found' });
      }

      const { _count, submission, ...rest } = challenge;
      const totalPages = Math.ceil(_count.sharedSolution / SOLUTIONS_PAGE_SIZE);

      return {
        ...rest,
        submission: submission || [],
        totalPages,
        hasMore: page < totalPages,
      };
    }),

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

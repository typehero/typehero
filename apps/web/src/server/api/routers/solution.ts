import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { orderBy } from '~/utils/sorting';

const SOLUTIONS_PAGE_SIZE = 10;

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
});

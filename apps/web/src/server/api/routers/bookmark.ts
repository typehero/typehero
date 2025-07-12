import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { createCacheKeyForBookmarksTab } from '~/app/challenge/_components/bookmark.helpers';

export const bookmarkRouter = createTRPCRouter({
  toggle: protectedProcedure
    .input(
      z.object({
        challengeId: z.number(),
        shouldBookmark: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { challengeId, shouldBookmark } = input;
      const userId = ctx.session.user.id;

      const bookmarkExists = await ctx.db.bookmark.findFirst({
        where: {
          challengeId,
          userId,
        },
      });

      if (!bookmarkExists && shouldBookmark) {
        await ctx.db.bookmark.create({
          data: {
            challengeId,
            userId,
          },
        });
      }

      if (bookmarkExists && !shouldBookmark) {
        await ctx.db.bookmark.delete({
          where: {
            id: bookmarkExists.id,
          },
        });
      }

      revalidateTag(createCacheKeyForBookmarksTab(userId));

      return { success: true };
    }),
});
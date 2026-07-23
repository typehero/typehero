import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { createCacheKeyForBookmarksTab } from '~/app/challenge/_components/bookmark.helpers';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const bookmarkRouter = createTRPCRouter({
  /**
   * Adds or removes a bookmark on a challenge for the current user.
   *
   * The bookmarked user is always derived from the session, so a client can only
   * ever bookmark on its own behalf.
   */
  addOrRemove: protectedProcedure
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

      revalidateTag(createCacheKeyForBookmarksTab(userId), 'max');
    }),
});

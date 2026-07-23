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

      if (shouldBookmark) {
        // Idempotent: relies on the @@unique([userId, challengeId]) constraint so
        // concurrent adds can't create duplicates.
        await ctx.db.bookmark.upsert({
          where: { userId_challengeId: { userId, challengeId } },
          create: { userId, challengeId },
          update: {},
        });
      } else {
        // Idempotent: won't throw if the row was already removed concurrently.
        await ctx.db.bookmark.deleteMany({
          where: { userId, challengeId },
        });
      }

      revalidateTag(createCacheKeyForBookmarksTab(userId), 'max');
    }),
});

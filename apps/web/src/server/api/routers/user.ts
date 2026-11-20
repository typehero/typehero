import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getTitles } from '~/app/challenge/_components/comments/enhanced-user-badge.getTitles';
import { getBadges } from '~/app/(profile)/[username]/user-info';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

const MAX_USERNAME_QUERY_LENGTH = 39;

export const userRouter = createTRPCRouter({
  /**
   * Username search used by the `@mention` autocomplete. Returns at most 10 matches.
   */
  searchUsers: publicProcedure
    .input(z.object({ query: z.string().max(MAX_USERNAME_QUERY_LENGTH) }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findMany({
        where: {
          name: {
            contains: input.query,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
        orderBy: {
          name: 'desc',
        },
        take: 10,
      });
    }),

  /**
   * Profile summary (bio, titles and the first three badges) for the user hover card.
   */
  getProfileData: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          name: input.username,
        },
        select: {
          image: true,
          bio: true,
          id: true,
          name: true,
          roles: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const badges = await getBadges(user.id);

      return {
        ...user,
        titles: getTitles(user.roles),
        badges: badges.slice(0, 3),
      };
    }),
});

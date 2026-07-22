import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { rateLimit } from '~/utils/rateLimit';

const NOTIFICATIONS_PER_PAGE = 50;

export const notificationRouter = createTRPCRouter({
  /**
   * Cursor-paginated notifications for the current user. Pass `mentionsOnly` to
   * only return mention notifications.
   */
  getNotifications: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        mentionsOnly: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, mentionsOnly } = input;

      const notifications = await ctx.db.notification.findMany({
        take: NOTIFICATIONS_PER_PAGE,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          toUserId: ctx.session.user.id,
          type: mentionsOnly ? 'MENTION' : undefined,
        },
        select: {
          id: true,
          blurb: true,
          createdAt: true,
          url: true,
          comment: {
            select: {
              id: true,
              rootType: true,
              text: true,
            },
          },
          isRead: true,
          content: true,
          fromUser: {
            select: {
              image: true,
              name: true,
            },
          },
          type: true,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
          {
            id: 'desc',
          },
        ],
      });

      if (notifications.length === 0) {
        return {
          notifications: [],
          cursor: undefined,
        };
      }

      const nextPage = await ctx.db.notification.findMany({
        take: 1,
        skip: 1,
        cursor: { id: notifications.at(-1)?.id },
        where: {
          toUserId: ctx.session.user.id,
          type: mentionsOnly ? 'MENTION' : undefined,
        },
        select: {
          id: true,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
          {
            id: 'desc',
          },
        ],
      });

      return {
        notifications,
        cursor: nextPage.length > 0 ? notifications.at(-1)?.id : undefined,
      };
    }),

  /**
   * Count of unread notifications for the current user.
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notification.count({
      where: {
        isRead: false,
        toUserId: ctx.session.user.id,
      },
    });
  }),

  /**
   * Marks the given notifications as read for the current user.
   */
  markAsRead: protectedProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.notification.updateMany({
        where: {
          toUserId: ctx.session.user.id,
          id: {
            in: input.ids,
          },
        },
        data: {
          isRead: true,
        },
      });
    }),

  /**
   * Marks all of the current user's notifications as read. Rate limited by IP.
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const ip = ctx.headers.get('x-forwarded-for') ?? 'unknown';
    const isRateLimited = rateLimit(ip);
    if (isRateLimited) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' });
    }

    await ctx.db.notification.updateMany({
      where: {
        toUserId: ctx.session.user.id,
      },
      data: {
        isRead: true,
      },
    });
  }),
});

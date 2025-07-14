import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name || 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        createdAt: true,
      },
    });
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          bio: input.bio,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          createdAt: true,
        },
      });
    }),

  getPublicProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          createdAt: true,
        },
      });
    }),
});
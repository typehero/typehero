import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.user.findUnique({
        where: { id },
      });
    }),
  byName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const { name } = input;
      return ctx.prisma.user.findFirst({
        where: {
          name: {
            equals: name,
          },
        },
      });
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          // email: z.string().min(1).max(32).optional(),
          name: z.string().min(1).optional(),
          // image: z.string().min(1).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const post = await ctx.prisma.user.update({
        where: { id },
        data,
      });
      return post;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await ctx.prisma.user.delete({ where: { id } });
      return {
        id,
      };
    }),
});

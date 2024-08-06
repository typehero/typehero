import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

const AOT_TRACKS = ['advent-of-typescript-2023'];
export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const aotEvents = await ctx.db.track.findMany({
      where: {
        slug: {
          in: AOT_TRACKS,
        },
      },
    });
    return aotEvents;
  }),
});

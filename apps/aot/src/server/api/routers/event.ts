import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

const AOT_TRACKS = ['advent-of-typescript-2023', 'advent-of-typescript-2024'];
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
  getEventChallengesByYear: publicProcedure
    .input(
      z.object({
        year: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const challenges = await ctx.db.track.findFirstOrThrow({
        where: {
          slug: `advent-of-typescript-${input.year}`,
        },
        select: {
          trackChallenges: {
            orderBy: {
              orderId: 'asc',
            },
            include: {
              challenge: {
                include: {
                  submission: {
                    where: {
                      userId: ctx.session?.user?.id || '',
                    },
                  },
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return challenges;
    }),
});

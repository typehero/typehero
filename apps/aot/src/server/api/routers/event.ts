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
  // todo: make a challenge route
  getEventChallengeBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // @TODO: actually select fields
      const challenge = await ctx.db.challenge.findFirstOrThrow({
        where: {
          slug: input.slug,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              roles: true,
              bio: true,
              image: true,
            },
          },
          _count: {
            select: {
              vote: true,
            },
          },
          vote: {
            where: {
              userId: ctx.session?.user?.id || '',
            },
          },
          bookmark: {
            where: {
              userId: ctx.session?.user?.id || '',
            },
          },
          submission: {
            where: {
              userId: ctx.session?.user?.id || '',
              isSuccessful: true,
            },
            take: 1,
          },
        },
      });

      return {
        ...challenge,
        hasSolved: challenge.submission.length > 0,
      };
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

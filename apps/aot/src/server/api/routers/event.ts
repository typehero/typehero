import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getCurrentAdventDay } from '~/utils/time-utils';
import { validateCompilerOptions } from '~/utils/validateCompilerOptions';

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

      const tsconfig = challenge.tsconfig;
      if (!validateCompilerOptions(tsconfig)) {
        throw new Error(`Challenge "${challenge.slug}" has an invalid tsconfig`);
      }

      return {
        ...challenge,
        tsconfig,
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
      const currentAdventDay = getCurrentAdventDay();
      // Get the starting id of this year (first aot was 2023)
      const startId = (Number(input.year) - 2023) * 25 + 1;
      const endId = startId + currentAdventDay - 1;

      const challenges = await ctx.db.trackChallenge.findMany({
        include: {
          challenge: {
            include: {
              user: true,
              submission: {
                where: {
                  userId: ctx.session?.user?.id || '',
                },
              },
            },
          },
        },
        where: {
          id: {
            gte: startId,
            lte: endId,
          },
        },
        orderBy: { orderId: 'asc' },
      });

      return challenges;
    }),
});

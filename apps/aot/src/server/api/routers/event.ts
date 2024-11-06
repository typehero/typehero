import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getAotSlug } from '~/utils/getAotSlug';
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
      const day = String(currentAdventDay);
      const endSlug = getAotSlug({ year: input.year, day });

      const challenges = await ctx.db.challenge.findMany({
        where: {
          slug: {
            gte: `${input.year}-1`,
            lte: endSlug,
          },
        },
        orderBy: {
          slug: 'asc',
        },
        include: {
          user: true,
          submission: {
            where: {
              userId: ctx.session?.user?.id || '',
            },
          },
        },
      });

      return challenges;
    }),
});

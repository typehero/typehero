import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { THREE_MONTHS } from '~/app/share/_actions/increment-time';
import { newShortURLSlug } from '~/app/share/_actions/shortUrlSlug';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';
import { isAdmin } from '~/utils/auth-guards';
import { getBaseUrl } from '~/utils/getBaseUrl';
import { rateLimit } from '~/utils/rateLimit';

const urlInput = z.string().url().max(100_000);

export const shortUrlRouter = createTRPCRouter({
  /**
   * Creates (or reuses) a short URL with an auto-generated slug. Open to anonymous
   * users, so it is rate limited by IP.
   *
   * Unless `forceNewUrl` is set, an existing short URL for the same original URL is returned
   * instead of creating a new one.
   */
  create: publicProcedure
    .input(
      z.object({
        url: urlInput,
        forceNewUrl: z.boolean().optional(),
        expiresAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ip = ctx.headers.get('x-forwarded-for') ?? 'unknown';
      if (rateLimit(`short-url:${ip}`)) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' });
      }

      const baseURL = getBaseUrl();

      if (!input.forceNewUrl) {
        const existing = await ctx.db.shortURL.findFirst({
          where: { originalUrl: input.url },
        });

        if (existing) {
          return `${baseURL}/share/${existing.shortUrlSlug}`;
        }
      }

      const slug = newShortURLSlug();

      await ctx.db.shortURL.create({
        data: {
          shortUrlSlug: slug,
          originalUrl: input.url,
          expiresAt: input.expiresAt ?? new Date(Date.now() + THREE_MONTHS),
        },
      });

      return `${baseURL}/share/${slug}`;
    }),

  /**
   * Creates a short URL with a custom slug. Admin only.
   *
   * Fails with `CONFLICT` when the slug is taken, unless `overwrite` is set.
   */
  createWithSlug: protectedProcedure
    .input(
      z.object({
        url: urlInput,
        slug: z.string().min(1).max(191),
        expiresAt: z.date().optional(),
        overwrite: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!isAdmin(ctx.session)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can set a custom slug' });
      }

      const { url, slug, overwrite } = input;
      const expiresAt = input.expiresAt ?? new Date(Date.now() + THREE_MONTHS);

      const existingSlug = await ctx.db.shortURL.findUnique({
        where: { shortUrlSlug: slug },
      });

      if (existingSlug && !overwrite) {
        throw new TRPCError({ code: 'CONFLICT', message: `Slug '${slug}' already exists` });
      }

      await ctx.db.shortURL.upsert({
        where: { shortUrlSlug: slug },
        update: { originalUrl: url, expiresAt },
        create: { shortUrlSlug: slug, originalUrl: url, expiresAt },
      });

      return `${getBaseUrl()}/share/${slug}`;
    }),
});

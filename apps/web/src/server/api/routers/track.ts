import { TRPCError } from '@trpc/server';
import { track as vercelTrack } from '@vercel/analytics/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { getTrackDetails } from '~/app/tracks/_components/get-track-details';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

const trackIdInput = z.object({ trackId: z.number().int() });

export const trackRouter = createTRPCRouter({
  /**
   * A track with its ordered challenges, plus the viewer's submissions on them and whether
   * they're enrolled (both empty when signed out).
   */
  getDetails: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(191) }))
    .query(async ({ ctx, input }) => {
      const track = await getTrackDetails(input.slug, ctx.session?.user?.id);
      if (!track) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Track not found' });
      }
      return track;
    }),

  /** Enrolls the current user in a track that is published. Enrolling twice is a no-op. */
  enroll: protectedProcedure.input(trackIdInput).mutation(async ({ ctx, input }) => {
    const track = await ctx.db.track.findFirst({
      where: { id: input.trackId, visible: true, isComingSoon: false },
      select: { id: true, slug: true },
    });
    if (!track) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Track not found' });
    }

    await ctx.db.track.update({
      where: { id: track.id },
      data: { enrolledUsers: { connect: { id: ctx.session.user.id } } },
    });

    vercelTrack?.('track-action', { action: 'enrolled', slug: track.slug });
    revalidateTag(`track-${track.id}-detail`, 'max');
  }),

  /** Un-enrolls the current user from a track. Un-enrolling when not enrolled is a no-op. */
  unenroll: protectedProcedure.input(trackIdInput).mutation(async ({ ctx, input }) => {
    const track = await ctx.db.track.findFirst({
      where: { id: input.trackId },
      select: { id: true, slug: true },
    });
    if (!track) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Track not found' });
    }

    await ctx.db.track.update({
      where: { id: track.id },
      data: { enrolledUsers: { disconnect: { id: ctx.session.user.id } } },
    });

    vercelTrack?.('track-action', { action: 'unenrolled', slug: track.slug });
    revalidateTag(`track-${track.id}-detail`, 'max');
  }),
});

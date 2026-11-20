import { TRPCError } from '@trpc/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { createCacheKeyForSolutions } from '~/app/challenge/[slug]/solutions/_components/solutions.helpers';
import {
  createChallengeSubmissionCacheKey,
  createCompletedSubmissionCacheKey,
  createInProgressSubmissionCacheKey,
} from '~/app/challenge/[slug]/submissions/[[...catchAll]]/cache-keys';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

/** Generous upper bound for a single submission's source; real answers are a few hundred bytes. */
export const MAX_SUBMISSION_CODE_LENGTH = 100_000;

export const submissionRouter = createTRPCRouter({
  /**
   * Records the current user's attempt at a challenge.
   *
   * The user comes from the session and the challenge's slug (needed for cache tags) comes
   * from the database, so the client only sends the challenge id, its code and the
   * result of the type tests it ran in the editor. Only ACTIVE challenges accept submissions.
   */
  create: protectedProcedure
    .input(
      z.object({
        challengeId: z.number().int(),
        code: z.string().max(MAX_SUBMISSION_CODE_LENGTH),
        isSuccessful: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const challenge = await ctx.db.challenge.findFirst({
        where: { id: input.challengeId, status: 'ACTIVE' },
        select: { slug: true },
      });
      if (!challenge) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Challenge not found' });
      }

      const submission = await ctx.db.submission.create({
        data: {
          challengeId: input.challengeId,
          userId,
          code: input.code,
          isSuccessful: input.isSuccessful,
        },
        select: { id: true, isSuccessful: true },
      });

      revalidateTag(createChallengeSubmissionCacheKey(challenge.slug), 'max');
      revalidateTag(createCacheKeyForSolutions(challenge.slug), 'max');
      revalidateTag(createInProgressSubmissionCacheKey(userId), 'max');
      revalidateTag(createCompletedSubmissionCacheKey(userId), 'max');

      return submission;
    }),

  /**
   * One of the current user's own submissions. Other users' submissions are reported as
   * not found rather than forbidden so ids can't be probed.
   */
  getById: protectedProcedure
    .input(z.object({ submissionId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.submission.findFirst({
        where: { id: input.submissionId, userId: ctx.session.user.id },
        include: { challenge: { select: { name: true } } },
      });
      if (!submission) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Submission not found' });
      }
      return submission;
    }),
});

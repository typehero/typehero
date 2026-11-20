import { IssueType } from '@repo/db/types';
import { z } from 'zod';

import { MAX_REPORT_TEXT_LENGTH } from '~/components/ReportDialog/report-limits';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

const baseReportInput = {
  text: z.string().max(MAX_REPORT_TEXT_LENGTH),
  issues: z.array(z.object({ type: z.nativeEnum(IssueType) })),
};

const reportInput = z.discriminatedUnion('type', [
  z.object({ ...baseReportInput, type: z.literal('CHALLENGE'), challengeId: z.number() }),
  z.object({ ...baseReportInput, type: z.literal('COMMENT'), commentId: z.number() }),
  z.object({ ...baseReportInput, type: z.literal('SOLUTION'), solutionId: z.number() }),
  z.object({ ...baseReportInput, type: z.literal('USER'), userId: z.string() }),
]);

export const reportRouter = createTRPCRouter({
  /**
   * Files a report against a challenge, comment, solution or user.
   *
   * The reporter is always the session user and the status always starts as
   * `PENDING`. Returns `'already_exists'` when the reporter already has a pending
   * report against the same target, otherwise `'created'`.
   */
  create: protectedProcedure.input(reportInput).mutation(async ({ ctx, input }) => {
    const { issues, text } = input;
    const reporterId = ctx.session.user.id;

    const target = (() => {
      switch (input.type) {
        case 'CHALLENGE':
          return { challengeId: input.challengeId };
        case 'COMMENT':
          return { commentId: input.commentId };
        case 'SOLUTION':
          return { solutionId: input.solutionId };
        case 'USER':
          return { userId: input.userId };
      }
    })();

    const alreadyReported = await ctx.db.report.findFirst({
      where: {
        type: input.type,
        status: 'PENDING',
        reporterId,
        ...target,
      },
    });

    if (alreadyReported) return 'already_exists' as const;

    await ctx.db.report.create({
      data: {
        ...target,
        type: input.type,
        text,
        reporterId,
        status: 'PENDING',
        updatedAt: new Date(),
        issues: {
          createMany: {
            data: issues,
          },
        },
      },
    });

    return 'created' as const;
  }),
});

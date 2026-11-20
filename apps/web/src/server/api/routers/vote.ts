import type { prisma } from '@repo/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

type Db = typeof prisma;

const voteTarget = z.discriminatedUnion('rootType', [
  z.object({ rootType: z.literal('CHALLENGE'), rootId: z.number() }),
  z.object({ rootType: z.literal('COMMENT'), rootId: z.number() }),
  z.object({ rootType: z.literal('SHAREDSOLUTION'), rootId: z.number() }),
]);

type VoteTarget = z.infer<typeof voteTarget>;

/**
 * Maps a vote target to the foreign key columns shared by the `Vote` and
 * `Notification` tables.
 */
function targetColumns(target: VoteTarget) {
  switch (target.rootType) {
    case 'CHALLENGE':
      return { challengeId: target.rootId };
    case 'COMMENT':
      return { commentId: target.rootId };
    case 'SHAREDSOLUTION':
      return { sharedSolutionId: target.rootId };
  }
}

/**
 * Looks up who owns the thing being voted on and where it lives. Both come from the
 * database rather than the client so a request can't redirect a notification to
 * another user or point it at an unrelated page.
 */
async function resolveTarget(db: Db, target: VoteTarget) {
  const notFound = new TRPCError({ code: 'NOT_FOUND', message: 'Nothing to vote on' });

  switch (target.rootType) {
    case 'CHALLENGE': {
      const challenge = await db.challenge.findUnique({
        where: { id: target.rootId },
        select: { userId: true, slug: true },
      });
      if (!challenge) throw notFound;
      return { ownerId: challenge.userId, url: `/challenge/${challenge.slug}` };
    }
    case 'COMMENT': {
      const comment = await db.comment.findUnique({
        where: { id: target.rootId },
        select: {
          userId: true,
          rootType: true,
          rootSolutionId: true,
          rootChallenge: { select: { slug: true } },
          rootSolution: { select: { challenge: { select: { slug: true } } } },
        },
      });
      if (!comment) throw notFound;

      const url =
        comment.rootType === 'CHALLENGE'
          ? `/challenge/${comment.rootChallenge?.slug}/comments/${target.rootId}`
          : `/challenge/${comment.rootSolution?.challenge?.slug}/solutions/${comment.rootSolutionId}/comments/${target.rootId}`;
      return { ownerId: comment.userId, url };
    }
    case 'SHAREDSOLUTION': {
      const solution = await db.sharedSolution.findUnique({
        where: { id: target.rootId },
        select: { userId: true, challenge: { select: { slug: true } } },
      });
      if (!solution) throw notFound;
      return {
        ownerId: solution.userId,
        url: `/challenge/${solution.challenge?.slug}/solutions/${target.rootId}`,
      };
    }
  }
}

export const voteRouter = createTRPCRouter({
  /**
   * Adds or removes the current user's upvote on a challenge, comment or shared solution.
   *
   * Idempotent in both directions: voting twice leaves one vote and removing a vote that
   * is already gone is a no-op. The voter is always the session user and the notified
   * user is always the owner of the content.
   */
  addOrRemove: protectedProcedure
    .input(z.intersection(voteTarget, z.object({ shouldVote: z.boolean() })))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const columns = targetColumns(input);
      const { ownerId, url } = await resolveTarget(ctx.db, input);

      if (input.shouldVote) {
        const existing = await ctx.db.vote.findFirst({
          where: { userId, rootType: input.rootType, ...columns },
          select: { id: true },
        });
        if (existing) return;

        await ctx.db.vote.create({
          data: { userId, rootType: input.rootType, ...columns },
        });

        // Voting on your own content or on content with no owner never notifies.
        if (ownerId && ownerId !== userId) {
          // A failed notification must not fail (or block) the vote itself.
          await ctx.db.notification
            .create({
              data: {
                type: 'LIKE',
                blurb: `liked your ${input.rootType.toLowerCase()}`,
                url,
                fromUserId: userId,
                toUserId: ownerId,
                ...columns,
              },
            })
            .catch(console.error);
        }
        return;
      }

      // Atomic so a failure can't remove the vote but leave its notification behind
      // (or report an error after the vote is already gone).
      await ctx.db.$transaction([
        ctx.db.vote.deleteMany({
          where: { userId, rootType: input.rootType, ...columns },
        }),
        ctx.db.notification.deleteMany({
          where: { type: 'LIKE', fromUserId: userId, ...columns },
        }),
      ]);
    }),
});

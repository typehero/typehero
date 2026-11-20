import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getMentionsFromComment } from '~/app/challenge/_components/comments/getMentionsFromComment';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { createNoProfanitySchemaWithValidate } from '~/utils/antiProfanityZod';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';

import type { prisma } from '@repo/db';

type Db = typeof prisma;

export const MAX_COMMENT_LENGTH = 10_000;

const commentText = createNoProfanitySchemaWithValidate((zodString) =>
  zodString.min(1, 'Too short.').max(MAX_COMMENT_LENGTH, 'Too long.'),
);

const lower = (name: string) => name.toLowerCase();

/** The users mentioned in `text`, minus anyone in `excludeNames` (case-insensitive). */
function mentionsExcluding(text: string, excludeNames: (string | null | undefined)[]) {
  const excluded = new Set(excludeNames.map((name) => lower(name ?? '')));
  return getMentionsFromComment(text).filter((mention) => !excluded.has(lower(mention)));
}

/**
 * Sends a MENTION notification to each of `mentions` that is an existing user. Failures
 * are logged and never fail the comment itself.
 */
async function notifyMentions(
  db: Db,
  {
    mentions,
    commentId,
    fromUserId,
    url,
  }: { mentions: string[]; commentId: number; fromUserId: string; url: string },
) {
  const results = await Promise.allSettled(
    mentions.map(async (mention) => {
      const user = await db.user.findFirst({ where: { name: mention }, select: { id: true } });
      if (!user) return;
      await db.notification.create({
        data: { type: 'MENTION', url, commentId, fromUserId, toUserId: user.id },
      });
    }),
  );
  for (const result of results) {
    if (result.status === 'rejected') console.error(result.reason);
  }
}

async function createNotification(
  db: Db,
  data: Parameters<Db['notification']['create']>[0]['data'],
) {
  await db.notification.create({ data }).catch(console.error);
}

const commentUrls = {
  challengeComment: (slug: string | undefined, commentId: number) =>
    `/challenge/${slug}/comments/${commentId}`,
  solutionComment: (slug: string | undefined, solutionId: number | null, commentId: number) =>
    `/challenge/${slug}/solutions/${solutionId}/comments/${commentId}`,
  challengeReply: (slug: string | undefined, parentId: number, replyId: number) =>
    `/challenge/${slug}/comments/${parentId}?replyId=${replyId}`,
  solutionReply: (
    slug: string | undefined,
    solutionId: number | null,
    parentId: number,
    replyId: number,
  ) => `/challenge/${slug}/solutions/${solutionId}/comments/${parentId}?replyId=${replyId}`,
};

const rootTarget = z.discriminatedUnion('rootType', [
  z.object({ rootType: z.literal('CHALLENGE'), rootId: z.number().int() }),
  z.object({ rootType: z.literal('SOLUTION'), rootId: z.number().int() }),
]);

export const commentRouter = createTRPCRouter({
  /**
   * Posts a top-level comment on a challenge or a shared solution.
   *
   * The author is the session user; who owns the thing being commented on, and the url a
   * notification links to, come from the database rather than from the client.
   */
  create: protectedProcedure
    .input(z.intersection(rootTarget, z.object({ text: commentText })))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const notFound = new TRPCError({ code: 'NOT_FOUND', message: 'Nothing to comment on' });

      let ownerId: string | null;
      let ownerName: string | undefined;
      let slug: string | undefined;

      if (input.rootType === 'CHALLENGE') {
        const challenge = await ctx.db.challenge.findFirst({
          where: { id: input.rootId, status: 'ACTIVE' },
          select: { slug: true, userId: true, user: { select: { name: true } } },
        });
        if (!challenge) throw notFound;
        ({ userId: ownerId, slug } = challenge);
        ownerName = challenge.user.name;
      } else {
        const solution = await ctx.db.sharedSolution.findUnique({
          where: { id: input.rootId },
          select: {
            userId: true,
            user: { select: { name: true } },
            challenge: { select: { slug: true } },
          },
        });
        if (!solution) throw notFound;
        ownerId = solution.userId;
        ownerName = solution.user?.name;
        slug = solution.challenge?.slug;
      }

      const comment = await ctx.db.comment.create({
        data: {
          text: input.text,
          rootType: input.rootType,
          userId,
          ...(input.rootType === 'CHALLENGE'
            ? { rootChallengeId: input.rootId }
            : { rootSolutionId: input.rootId }),
        },
        select: { id: true },
      });

      const url =
        input.rootType === 'CHALLENGE'
          ? commentUrls.challengeComment(slug, comment.id)
          : commentUrls.solutionComment(slug, input.rootId, comment.id);

      await Promise.all([
        // Nobody is notified about commenting on their own challenge or solution.
        ownerId && ownerId !== userId
          ? createNotification(ctx.db, {
              type: 'REPLY',
              url,
              commentId: comment.id,
              fromUserId: userId,
              toUserId: ownerId,
            })
          : undefined,
        // The owner already gets the reply notification, and you can't notify yourself.
        notifyMentions(ctx.db, {
          mentions: mentionsExcluding(input.text, [ownerName ?? '', ctx.session.user.name]),
          commentId: comment.id,
          fromUserId: userId,
          url,
        }),
      ]);

      return comment;
    }),

  /** Replies to a top-level comment. The reply belongs to the same challenge or solution. */
  reply: protectedProcedure
    .input(z.object({ parentId: z.number().int(), text: commentText }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const parent = await ctx.db.comment.findUnique({
        where: { id: input.parentId },
        select: {
          id: true,
          userId: true,
          parentId: true,
          rootType: true,
          rootChallengeId: true,
          rootSolutionId: true,
          user: { select: { name: true } },
          rootChallenge: { select: { slug: true } },
          rootSolution: { select: { challenge: { select: { slug: true } } } },
        },
      });
      if (!parent) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }
      if (parent.parentId !== null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You can only reply to top-level comments',
        });
      }

      const reply = await ctx.db.comment.create({
        data: {
          text: input.text,
          rootType: parent.rootType,
          rootChallengeId: parent.rootChallengeId,
          rootSolutionId: parent.rootSolutionId,
          parentId: parent.id,
          userId,
        },
        select: { id: true },
      });

      const url =
        parent.rootType === 'CHALLENGE'
          ? commentUrls.challengeReply(parent.rootChallenge?.slug, parent.id, reply.id)
          : commentUrls.solutionReply(
              parent.rootSolution?.challenge?.slug,
              parent.rootSolutionId,
              parent.id,
              reply.id,
            );

      await Promise.all([
        // Replying to your own comment doesn't notify you.
        parent.userId !== userId
          ? createNotification(ctx.db, {
              type: 'REPLY',
              url,
              commentId: reply.id,
              fromUserId: userId,
              toUserId: parent.userId,
            })
          : undefined,
        notifyMentions(ctx.db, {
          mentions: mentionsExcluding(input.text, [parent.user.name, ctx.session.user.name]),
          commentId: reply.id,
          fromUserId: userId,
          url,
        }),
      ]);

      return reply;
    }),

  /**
   * Edits the text of one of your own comments, notifying newly mentioned users and
   * retracting the notification of anyone whose mention was removed.
   */
  update: protectedProcedure
    .input(z.object({ id: z.number().int(), text: commentText }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          text: true,
          userId: true,
          parentId: true,
          rootType: true,
          rootSolutionId: true,
          parentComment: { select: { id: true, rootChallenge: { select: { slug: true } } } },
          rootChallenge: { select: { slug: true, user: { select: { name: true } } } },
          rootSolution: {
            select: { user: { select: { name: true } }, challenge: { select: { slug: true } } },
          },
        },
      });
      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }
      if (!isAuthor(ctx.session, comment.userId)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own comments' });
      }

      const rootOwnerName =
        (comment.rootType === 'CHALLENGE'
          ? comment.rootChallenge?.user.name
          : comment.rootSolution?.user?.name) ?? '';
      const excludeNames = [rootOwnerName, ctx.session.user.name];

      const before = mentionsExcluding(comment.text, excludeNames);
      const after = mentionsExcluding(input.text, excludeNames);
      const removed = before.filter((mention) => !after.includes(mention));
      const added = after.filter((mention) => !before.includes(mention));

      const updated = await ctx.db.comment.update({
        where: { id: comment.id },
        data: { text: input.text },
        select: { id: true },
      });

      if (added.length > 0) {
        const url = !comment.parentId
          ? comment.rootType === 'CHALLENGE'
            ? commentUrls.challengeComment(comment.rootChallenge?.slug, comment.id)
            : commentUrls.solutionComment(
                comment.rootSolution?.challenge?.slug,
                comment.rootSolutionId,
                comment.id,
              )
          : comment.rootType === 'CHALLENGE'
            ? commentUrls.challengeReply(
                comment.parentComment?.rootChallenge?.slug,
                comment.parentComment?.id ?? comment.parentId,
                comment.id,
              )
            : commentUrls.solutionReply(
                comment.rootSolution?.challenge?.slug,
                comment.rootSolutionId,
                comment.parentComment?.id ?? comment.parentId,
                comment.id,
              );

        await notifyMentions(ctx.db, {
          mentions: added,
          commentId: comment.id,
          fromUserId: userId,
          url,
        });
      }

      if (removed.length > 0) {
        await Promise.allSettled(
          removed.map(async (mention) => {
            const user = await ctx.db.user.findFirst({
              where: { name: mention },
              select: { id: true },
            });
            if (!user) return;
            await ctx.db.notification.deleteMany({
              where: {
                type: 'MENTION',
                commentId: comment.id,
                fromUserId: userId,
                toUserId: user.id,
              },
            });
          }),
        );
      }

      return updated;
    }),

  /**
   * Deletes a comment together with its replies and their notifications. Allowed for the
   * comment's author and for admins and moderators.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.id },
        select: { id: true, userId: true },
      });
      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' });
      }
      if (!isAdminOrModerator(ctx.session) && !isAuthor(ctx.session, comment.userId)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only delete your own comments',
        });
      }

      const replyIds = (
        await ctx.db.comment.findMany({ where: { parentId: comment.id }, select: { id: true } })
      ).map((reply) => reply.id);

      // Notifications reference the comments, so they have to go first.
      await ctx.db.$transaction([
        ctx.db.notification.deleteMany({
          where: { commentId: { in: [comment.id, ...replyIds] } },
        }),
        ctx.db.comment.deleteMany({ where: { id: { in: replyIds } } }),
        ctx.db.comment.delete({ where: { id: comment.id } }),
      ]);
    }),
});

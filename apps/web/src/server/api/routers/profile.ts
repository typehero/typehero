import { EditFormSchema } from '~/app/(profile)/[username]/edit/_components/edit-form.schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const profileRouter = createTRPCRouter({
  /**
   * Updates the current user's bio and links. Only ever touches the session user's own
   * profile. Blank link slots are dropped rather than stored.
   *
   * Returns the username so the client can navigate to the profile.
   */
  update: protectedProcedure.input(EditFormSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const urls = input.userLinks.map((link) => link.url).filter((url) => url !== '');

    const user = await ctx.db.$transaction(async (tx) => {
      const oldLinks = await tx.userLink.findMany({
        where: { user: { some: { id: userId } } },
        select: { id: true },
      });

      // Disconnecting first clears the implicit join table rows; deleting the links on
      // their own would leave them behind because the database has no foreign keys.
      const updated = await tx.user.update({
        where: { id: userId },
        data: {
          bio: input.bio,
          userLinks: { set: [], create: urls.map((url) => ({ url })) },
        },
        select: { name: true },
      });
      await tx.userLink.deleteMany({ where: { id: { in: oldLinks.map((link) => link.id) } } });

      return updated;
    });

    return { name: user.name };
  }),
});

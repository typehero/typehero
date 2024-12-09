import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Role, RoleTypes, User } from '@repo/db/types';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@repo/db';
import type { NextAuthConfig } from 'next-auth';

export type { Session, DefaultSession as DefaultAuthSession } from 'next-auth';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: User & { role: RoleTypes[] };
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends User {
    roles: Role[];
  }
}

export const baseNextAuthConfig: Omit<NextAuthConfig, 'providers'> = {
  pages: {
    signIn: '/login',
  },
  adapter: {
    ...PrismaAdapter(prisma),
    // Override createUser method to add default USER role
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          ...data,
          name: data.name ?? '',
          roles: {
            connectOrCreate: {
              where: { role: 'USER' },
              create: { role: 'USER' },
            },
          },
        },
        include: { roles: true },
      });
      return user;
    },
    // Override getSessionAndUser method to include roles. Avoids a second db query in session callback
    getSessionAndUser: async (sessionToken) => {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { roles: true } } },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },
  },
  callbacks: {
    session: (opts) => {
      if (!('user' in opts)) throw new Error("unreachable, we're not using JWT");

      const { session, user } = opts;
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.roles.map((r) => r.role),
        },
      };
    },
  },
};

export const createGitHubProvider = (clientId: string, clientSecret: string) => {
  return GitHubProvider({
    clientId,
    clientSecret,
    profile: (p) => ({
      id: p.id.toString(),
      name: p.login,
      email: p.email,
      image: p.avatar_url,
    }),
  });
};

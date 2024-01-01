import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Role, RoleTypes } from '@repo/db/types';
import type { Adapter, AdapterUser, AdapterSession } from '@auth/core/adapters';
import { type DefaultSession, type User } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@repo/db';
import NextAuth from './next-auth';

export type { Session, DefaultSession as DefaultAuthSession } from 'next-auth';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: RoleTypes[];
    };
  }

  interface User {
    createdAt: Date;
    roles: Role[];
  }
}

if (!process.env.GITHUB_ID) {
  throw new Error('No GITHUB_ID has been provided.');
}

if (!process.env.GITHUB_SECRET) {
  throw new Error('No GITHUB_SECRET has been provided.');
}

const useSecureCookies = process.env.VERCEL_ENV === 'production';
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const cookieDomain = useSecureCookies ? 'typehero.dev' : undefined;

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: cookieDomain,
        secure: useSecureCookies,
      },
    },
  },
  adapter: {
    ...(PrismaAdapter(prisma) as Adapter),
    // Override createUser method to add default USER role
    createUser: (data) =>
      prisma.user.create({
        data: {
          ...data,
          name: data.name ?? '',
          roles: {
            connectOrCreate: {
              where: {
                role: 'USER',
              },
              create: {
                role: 'USER',
              },
            },
          },
        },
        include: { roles: true },
      }) as Promise<AdapterUser>,
    // Override getUser method to include roles. Avoids a second db query in session callback
    getSessionAndUser: async (sessionToken) => {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { roles: true } } },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session } as { session: AdapterSession; user: AdapterUser };
    },
  },
  callbacks: {
    session: async ({ session, user }) => {
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
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile: (p) =>
        ({
          id: p.id.toString(),
          name: p.login,
          email: p.email,
          image: p.avatar_url,
        }) as User, // TODO: Remove typecast
    }),
  ],
});

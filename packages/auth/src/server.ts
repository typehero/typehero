import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Role, RoleTypes } from '@repo/db/types';
import { type DefaultSession } from 'next-auth';
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
  interface Session extends DefaultSession {
    user?: DefaultSession['user'] & {
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
  callbacks: {
    session: async ({ session, user }) => {
      let userRoles: RoleTypes[] = [];
      if (user.roles) {
        userRoles = user.roles.reduce((acc: RoleTypes[], role) => {
          acc.push(role.role);
          return acc;
        }, []);
      }
      if (!userRoles.includes('USER')) {
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
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
          include: {
            roles: true,
          },
        });
        userRoles = updatedUser.roles.reduce((acc: RoleTypes[], role) => {
          acc.push(role.role);
          return acc;
        }, []);
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: userRoles,
          createAt: user.createdAt,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
});

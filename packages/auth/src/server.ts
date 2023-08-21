import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Role, RoleTypes } from '@repo/db/types';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@repo/db';

export type { Session, DefaultSession as DefaultAuthSession } from 'next-auth';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
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

export const authOptions: NextAuthOptions = {
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session: async ({ session, user }) => {
      // 1. State
      let userRoles: RoleTypes[] = [];

      // 2. If user already has roles, reduce them to a RoleTypes array.
      if (user.roles) {
        userRoles = user.roles.reduce((acc: RoleTypes[], role) => {
          acc.push(role.role);
          return acc;
        }, []);
      }

      // 3. If the current user doesn't have a USER role. Assign one.
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
};
const useSecureCookies = Boolean(process.env.VERCEL_URL);

export const adminAuthOptions: NextAuthOptions = {
  ...authOptions,
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: `${process.env.VERCEL_URL}`,
        secure: useSecureCookies,
      },
    },
  },
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};

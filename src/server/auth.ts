import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Role, RoleTypes } from '@prisma/client';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: RoleTypes[];
    } & DefaultSession['user'];
  }

  interface User {
    createdAt: Date;
    roles: Role[];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
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
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

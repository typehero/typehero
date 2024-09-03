import NextAuth from '@repo/auth/next-auth';

import { baseNextAuthConfig, createGitHubProvider } from '@repo/auth/server';

if (!process.env.GITHUB_AOT_ID) {
  throw new Error('No GITHUB_AOT_ID has been provided.');
}

if (!process.env.GITHUB_AOT_SECRET) {
  throw new Error('No GITHUB_AOT_SECRET has been provided.');
}

export const authOptions = {
  ...baseNextAuthConfig,
  providers: [createGitHubProvider(process.env.GITHUB_AOT_ID, process.env.GITHUB_AOT_SECRET)],
};

export const { handlers, auth } = NextAuth(authOptions);

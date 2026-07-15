import 'server-only';

import NextAuth from '@repo/auth/next-auth';

import { baseNextAuthConfig, createGitHubProvider } from '@repo/auth/server';

const githubId = process.env.GITHUB_AOT_ID;
const githubSecret = process.env.GITHUB_AOT_SECRET;

if (!githubId) {
  throw new Error('No GITHUB_AOT_ID has been provided.');
}

if (!githubSecret) {
  throw new Error('No GITHUB_AOT_SECRET has been provided.');
}

export const authOptions = {
  ...baseNextAuthConfig,
  providers: [createGitHubProvider(githubId, githubSecret)],
};

export const { handlers, auth } = NextAuth(authOptions);

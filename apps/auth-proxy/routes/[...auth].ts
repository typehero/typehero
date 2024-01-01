import { Auth } from '@auth/core';
import Github from '@auth/core/providers/github';
import { eventHandler, toWebRequest } from 'h3';

export default eventHandler((event) =>
  Auth(toWebRequest(event), {
    secret: process.env.AUTH_SECRET,
    trustHost: Boolean(process.env.VERCEL),
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    providers: [
      Github({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  }),
);

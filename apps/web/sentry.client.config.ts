// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://612a99a42def98a6f2951b66e0d9d776@o4505790239604736.ingest.sentry.io/4505790257627136',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Request targets to which we want Sentry tracing headers attached
  tracePropagationTargets: ['localhost:3000', /^\//],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  enabled: process.env.NODE_ENV === 'production',
  environment:
    window.origin.includes('staging') || window.origin.includes('vercel.app')
      ? 'Staging'
      : 'Production',
});

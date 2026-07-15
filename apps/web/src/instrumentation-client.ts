import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://612a99a42def98a6f2951b66e0d9d776@o4505790239604736.ingest.sentry.io/4505790257627136',
  tracesSampleRate: 1,
  tracePropagationTargets: ['localhost:3000', /^\//],
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

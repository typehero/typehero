import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: 'https://612a99a42def98a6f2951b66e0d9d776@o4505790239604736.ingest.sentry.io/4505790257627136',
      tracesSampleRate: 1,
      debug: false,
      enabled: process.env.NODE_ENV === 'production',
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: 'https://612a99a42def98a6f2951b66e0d9d776@o4505790239604736.ingest.sentry.io/4505790257627136',
      tracesSampleRate: 1,
      debug: false,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;

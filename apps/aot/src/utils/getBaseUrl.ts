export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, we return a relative URL
    return '';
  }
  // When rendering on the server, we return an absolute URL

  // reference: https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL && process.env.VERCEL_ENV === 'production') {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL && process.env.VERCEL_ENV === 'preview') {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

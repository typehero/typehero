import { NextResponse, type NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});

export function middleware(req: NextRequest) {
  const { VERCEL_ENV: vercelEnv, STAGING: staging = false } = process.env;

  // skip blocking the request if local or preview or staging
  if (!vercelEnv || staging) {
    return I18nMiddleware(req);
  }

  const path = req.nextUrl.pathname;

  // if path is /explore or /challenge/* and redirect to /waitlist
  if (
    path === '/explore' ||
    path.startsWith('/challenge') ||
    path.startsWith('/challenge/') ||
    path.startsWith('/tracks') ||
    path.startsWith('/tracks/')
  ) {
    return NextResponse.redirect(new URL('/waitlist', req.url));
  }

  return I18nMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};

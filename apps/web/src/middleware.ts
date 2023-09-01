import { NextResponse, type NextRequest } from 'next/server';

const STAGING_DOMAIN = 'web-staging';
export function middleware(req: NextRequest) {
  console.log({ VERCEL_ENV: process.env.VERCEL_ENV, VERCEL_URL: process.env.VERCEL_URL });
  // skip blocking the request if we are on staging or local
  if (!process.env.VERCEL_ENV || process.env.VERCEL_URL?.includes(STAGING_DOMAIN)) {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;

  // if path is /explore or /challenge/* and redirect to /waitlist
  if (path === '/explore' || path.startsWith('/challenge/') || path.startsWith('/tracks/')) {
    return NextResponse.redirect(new URL('/waitlist', req.url));
  }

  return NextResponse.next();
}

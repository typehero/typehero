import { createI18nMiddleware } from 'next-international/middleware';
import { type NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});

export function middleware(req: NextRequest) {
  // Ignore the request to this endpoint made by the toolbar
  // because it ignores the i18n static params and provides
  // and invalid locale dynamic param
  if (req.nextUrl.pathname === '/.well-known/vercel-user-meta') {
    return new Response()
  }

  return I18nMiddleware(req);
}

export const config = {
  matcher: ['/.well-known/vercel-user-meta', '/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};

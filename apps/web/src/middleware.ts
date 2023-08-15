import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue ?? '').split(':');

      if (user === 'trash_dev' && pwd === 'trash') {
        return NextResponse.next();
      }
    }

    // Make the user get some damn creds
    url.pathname = '/api/auth/creds';

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

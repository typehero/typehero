import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // don't allow auth on preview domains so we can test shit
  if (req.headers.get("host") !== "typehero.dev") {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === 'production') {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue ?? '').split(':');

      if (user === 'trash' && pwd === 'isg0d') {
        return NextResponse.next();
      }
    }
    url.pathname = '/api/lol';

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import createIntlMiddleware from 'next-intl/middleware';
import { authConfig } from '@/lib/auth.config';
import { routing } from '@/i18n/routing';

const { auth } = NextAuth(authConfig);
const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_ACCOUNT_SEGMENTS = new Set(['login', 'register', 'forgot-password']);

function getLocaleAccountSegment(pathname: string): string | null {
  const match = pathname.match(/^\/(en|es)\/account(?:\/([^/]+))?/);
  if (!match) {
    return null;
  }
  return match[2] ?? '';
}

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';

    if (!isLoginPage && session?.user?.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && session?.user?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  const accountSegment = getLocaleAccountSegment(pathname);

  if (accountSegment !== null) {
    const isPublicAccountRoute =
      accountSegment === '' ? false : PUBLIC_ACCOUNT_SEGMENTS.has(accountSegment);

    if (!isPublicAccountRoute && session?.user?.role !== 'customer') {
      const locale = pathname.startsWith('/es') ? 'es' : 'en';
      const loginUrl = new URL(`/${locale}/account/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|uploads|brand|.*\\..*).*)'],
};

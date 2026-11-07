import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static assets, admin workspace, and SEO files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already includes a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect preferred language from Accept-Language header
  const acceptLang = request.headers.get('accept-language') || '';
  const preferredLocale = acceptLang.toLowerCase().startsWith('fr')
    ? 'fr'
    : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|images|favicon.ico).*)'],
};

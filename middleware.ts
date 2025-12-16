import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'tp_admin';

function isAdmin(req: NextRequest) {
  return req.cookies.get(ADMIN_COOKIE)?.value === '1';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin UI routes
  if (pathname.startsWith('/admin')) {
    if (!isAdmin(req)) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

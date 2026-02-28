import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth-edge';

export async function middleware(request) {
  const userId = await getUserIdFromRequest(request);
  const pathname = request.nextUrl.pathname;

  // Unauthenticated → redirect to login for protected routes
  if (!userId && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Authenticated → redirect away from login/signup
  if (userId && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Note: credit-gating is NOT done in middleware.
  // Users with 0 credits can access /dashboard — they see a "Buy more credits" CTA.
  // This prevents the race condition where a slow webhook causes a locked-out user.

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};

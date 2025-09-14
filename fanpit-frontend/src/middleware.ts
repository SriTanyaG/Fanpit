import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/bookings',
  '/dashboard',
  '/spaces/[^/]+/book', // Protect booking pages using regex
];

// Routes that should not be accessible when authenticated
const authRoutes = [
  '/login',
  '/signup',
];

// Routes that require brand_owner role
const brandOwnerRoutes = [
  '/dashboard',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Check protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check brand owner routes
  if (brandOwnerRoutes.some(route => pathname.startsWith(route))) {
    console.log('Checking brand owner route:', pathname, 'Token:', !!token, 'Role:', userRole);
    if (!token || userRole !== 'brand_owner') {
      console.log('Redirecting from dashboard - not brand owner');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users away from auth routes
  // Temporarily disabled for testing
  // if (authRoutes.some(route => pathname.startsWith(route)) && token) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
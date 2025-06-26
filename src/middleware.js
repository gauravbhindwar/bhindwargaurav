import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    try {
      // Get authentication token
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET
      });
      
      // Login page special handling
      if (pathname === '/admin/login') {
        // If already authenticated, redirect to dashboard
        if (token?.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        // Otherwise allow access to login
        return NextResponse.next();
      }
      
      // Setup page doesn't require authentication
      if (pathname === '/admin/setup') {
        return NextResponse.next();
      }
      
      // All other admin routes require authentication
      if (!token || token.role !== 'admin') {
        // Save intended destination for post-login redirect
        const loginUrl = new URL('/admin/login', request.url);
        if (pathname !== '/admin/dashboard') {
          loginUrl.searchParams.set('callbackUrl', pathname);
        }
        return NextResponse.redirect(loginUrl);
      }
      
      // User is authenticated, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error.message);
      // On error, redirect to login for security
      if (pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    }
  }

  // Add cache control headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    return response;
  }

  // For non-admin routes, continue without authentication
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};

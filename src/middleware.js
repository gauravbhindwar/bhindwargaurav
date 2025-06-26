import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin route protection  
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    });
    
    // Block setup route completely - redirect to setup disabled page
    if (pathname === '/admin/setup') {
      // Just show the disabled setup page, don't redirect
      return NextResponse.next();
    } else if (pathname !== '/admin/login') {
      // For all other admin routes (except login), require authentication
      if (!token || token.role !== 'admin') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Add cache control headers for API routes to improve performance
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Cache API responses for 5 minutes 
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60');
    
    return response;
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};

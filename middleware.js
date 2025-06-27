import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Allow access to login and setup pages without authentication
    if (pathname === '/admin/login' || pathname === '/admin/setup') {
      // If user is already authenticated, redirect to dashboard
      if (token) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      return NextResponse.next()
    }

    // For all other admin routes, check authentication and role
    if (pathname.startsWith('/admin')) {
      if (!token) {
        // Not authenticated, redirect to login
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }

      // Check if user has admin role
      if (token.role !== 'admin' && token.role !== 'super_admin') {
        // User doesn't have admin role, redirect to login
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }

      // User is authenticated and has admin role, allow access
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to login and setup pages
        if (pathname === '/admin/login' || pathname === '/admin/setup') {
          return true
        }

        // For admin routes, require authentication and admin role
        if (pathname.startsWith('/admin')) {
          return token && (token.role === 'admin' || token.role === 'super_admin')
        }

        // Allow access to non-admin routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/projects/:path*',
    '/api/skills/:path*',
    '/api/certifications/:path*',
    '/api/contact/:path*'
  ]
}

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminProtection({ children, requiredRole = 'admin' }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Handle authentication and redirects
  useEffect(() => {
    // Only redirect when status is definitively known and user isn't authenticated properly
    if (status !== 'loading' && (status === 'unauthenticated' || session?.user?.role !== requiredRole)) {
      // Save the current path as callbackUrl for post-login redirect
      const currentPath = window.location.pathname;
      const loginPath = '/admin/login';
      const redirectPath = currentPath !== '/admin/dashboard' 
        ? `${loginPath}?callbackUrl=${encodeURIComponent(currentPath)}`
        : loginPath;
      
      router.replace(redirectPath);
    }
  }, [session, status, router, requiredRole]);

  // Show loading while checking authentication or redirecting
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Show redirecting message when authenticated but without proper role
  // or when unauthenticated (but avoid flickering by showing only after a delay)
  if (status === 'unauthenticated' || session?.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated with correct role
  return children;
}

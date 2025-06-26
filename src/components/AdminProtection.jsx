'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminProtection({ children, requiredRole = 'admin' }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('AdminProtection - Status:', status)
    console.log('AdminProtection - Session:', session)
    console.log('AdminProtection - User Role:', session?.user?.role)
    
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      console.log('AdminProtection - Redirecting to login: unauthenticated')
      router.replace('/admin/login')
      return
    }

    if (session?.user?.role !== requiredRole) {
      console.log('AdminProtection - Redirecting to login: incorrect role', session?.user?.role, 'required:', requiredRole)
      router.replace('/admin/login')
      return
    }
    
    console.log('AdminProtection - Authentication successful')
  }, [session, status, router, requiredRole])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading while redirecting unauthenticated users
  if (status === 'unauthenticated' || session?.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return children
}

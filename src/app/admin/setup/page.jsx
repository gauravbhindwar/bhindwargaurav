'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminSetup() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login after a short delay
    const timer = setTimeout(() => {
      router.push('/admin/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Setup Disabled
          </h2>
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>
              For security reasons, admin setup via web interface has been disabled.
            </p>
            <p>
              To create an admin account, run the following command in your terminal:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <code className="text-sm font-mono text-gray-800">
                npm run create-admin
              </code>
            </div>
            <p className="mt-4">
              This ensures only users with server access can create admin accounts.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <Link
              href="/admin/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Portfolio
            </Link>
          </div>
          
          <p className="mt-4 text-xs text-gray-500">
            Redirecting to login in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

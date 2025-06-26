'use client'

import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

// Wrapper for the login form with Suspense for useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading secure login...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

'use client'

import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

// Wrapper for the login form with Suspense for useSearchParams
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading login form...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}

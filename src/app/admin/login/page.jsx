'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Separate component for handling search params
function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [setupRequired, setSetupRequired] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    checkSetupStatus()
    checkExistingSession()
    
    // Check for error from URL params
    const urlError = searchParams.get('error')
    if (urlError) {
      setError('Authentication failed. Please try again.')
    }
  }, [searchParams])

  const checkExistingSession = async () => {
    try {
      setLoading(true)
      const session = await getSession()
      console.log('Login page - Existing session check:', session)
      console.log('Login page - User role:', session?.user?.role)
      
      if (session?.user?.role === 'admin') {
        console.log('Login page - Admin session found, redirecting to dashboard')
        // Use router.replace to avoid adding to history
        router.replace('/admin/dashboard')
        return
      } else if (session) {
        console.log('Login page - Session found but not admin role:', session.user?.role)
      } else {
        console.log('Login page - No session found')
      }
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup')
      const data = await response.json()
      setSetupRequired(data.setupRequired)
    } catch (error) {
      console.error('Setup check error:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting login...')
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
        callbackUrl: '/admin/dashboard'
      })

      console.log('Login result:', result)

      if (result?.error) {
        console.error('Login error:', result.error)
        setError('Invalid username or password')
        setLoading(false)
      } else if (result?.ok) {
        console.log('Login successful, verifying session...')
        
        // Add retry logic for session verification in production
        let sessionVerified = false
        let attempts = 0
        const maxAttempts = 5
        
        while (!sessionVerified && attempts < maxAttempts) {
          attempts++
          await new Promise(resolve => setTimeout(resolve, 200 * attempts)) // Progressive delay
          
          try {
            const session = await getSession()
            if (session?.user?.role === 'admin') {
              sessionVerified = true
              console.log('Session verified, redirecting to dashboard...')
              router.replace('/admin/dashboard')
              return
            }
          } catch (sessionError) {
            console.error(`Session check attempt ${attempts} failed:`, sessionError)
          }
        }
        
        if (!sessionVerified) {
          console.error('Session verification failed after multiple attempts')
          // Force redirect anyway, let the dashboard handle authentication
          router.replace('/admin/dashboard')
        }
      } else {
        console.log('Unexpected result structure:', result)
        setError('Authentication failed. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login exception:', error)
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (setupRequired === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your portfolio
          </p>
        </div>
        
        {setupRequired && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="text-blue-800 text-sm">
              <p className="font-medium">Setup Required</p>
              <p className="mt-1">
                No admin account found. To create an admin account, run:
              </p>
              <div className="mt-2 p-2 bg-blue-100 rounded">
                <code className="text-xs font-mono">npm run create-admin</code>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || setupRequired}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

// Main component with Suspense boundary
export default function AdminLogin() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}

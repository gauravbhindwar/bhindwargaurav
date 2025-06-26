'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
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
      const session = await getSession()
      if (session && session.user && session.user.role === 'admin') {
        // Force redirect using window.location for better reliability
        window.location.href = '/admin/dashboard'
      }
    } catch (error) {
      console.error('Session check error:', error)
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
        redirect: false
      })

      console.log('Login result:', result)

      if (result?.error) {
        console.error('Login error:', result.error)
        setError('Invalid username or password')
      } else if (result?.ok) {
        console.log('Login successful, redirecting...')
        // Force a page refresh to ensure session is properly synchronized
        window.location.href = '/admin/dashboard'
      }
    } catch (error) {
      console.error('Login exception:', error)
      setError('An error occurred. Please try again.')
    } finally {
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

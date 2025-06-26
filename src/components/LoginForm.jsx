'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
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
    const initializeLogin = async () => {
      setLoading(true)
      try {
        await checkSetupStatus()
        await checkExistingSession()
        
        // Check for error from URL params
        if (searchParams) {
          const urlError = searchParams.get('error')
          if (urlError) {
            setError('Authentication failed. Please try again.')
          }
        }
      } catch (error) {
        console.error('Login initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeLogin()
  }, [searchParams])

  const checkExistingSession = async () => {
    try {
      const session = await getSession()
      
      if (session?.user?.role === 'admin') {
        const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard'
        router.replace(callbackUrl)
        return
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
      // Get callback URL from query params or use dashboard as default
      const callbackUrl = searchParams?.get('callbackUrl') || '/admin/dashboard'
      
      // Attempt authentication
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else if (result?.ok) {
        // Successful login - redirect using router to avoid full page reload
        router.replace(callbackUrl)
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (setupRequired === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking system status...</p>
        </div>
      </div>
    )
  }

  if (setupRequired === true) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Left Panel - Decorative */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 font-space">Gaurav Bhindwar</h1>
            <p className="text-lg text-blue-100 mb-8">Portfolio Setup</p>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm max-w-md">
              <p className="text-lg font-medium mb-2">Welcome!</p>
              <p className="text-sm opacity-80">
                It looks like this is your first time here. You'll need to set up an admin account
                to manage your portfolio content, projects, skills, and certifications.
              </p>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center mb-4">
              <div className="h-1 w-12 bg-white/50 mr-4 rounded-full"></div>
              <p className="text-sm opacity-70">Secured with Next.js and JWT authentication</p>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Setup CTA */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
            <div className="mb-8">
              <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Setup Required</h2>
              <p className="text-gray-600 mt-2">You need to create an admin account to continue</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Once set up, you'll be able to manage all aspects of your portfolio site through the admin dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <Link
              href="/admin/setup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Admin Account
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left Panel - Decorative */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-4 font-space">Gaurav Bhindwar</h1>
          <p className="text-lg text-blue-100 mb-8">Admin Dashboard</p>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm max-w-md">
            <p className="text-lg font-medium mb-2">Welcome back!</p>
            <p className="text-sm opacity-80">
              Log in to manage your portfolio content, projects, skills, and certifications.
              Your dashboard gives you full control over your professional presence.
            </p>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center mb-4">
            <div className="h-1 w-12 bg-white/50 mr-4 rounded-full"></div>
            <p className="text-sm opacity-70">Secured with Next.js and JWT authentication</p>
          </div>
          <div className="flex space-x-3">
            <img src="/globe.svg" alt="Globe icon" className="h-6 w-6 invert opacity-75" />
            <img src="/window.svg" alt="Window icon" className="h-6 w-6 invert opacity-75" />
            <img src="/file.svg" alt="File icon" className="h-6 w-6 invert opacity-75" />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6 md:hidden">
              <img src="/gaurav.jpg" alt="Gaurav Bhindwar" className="h-16 w-16 rounded-full object-cover border-2 border-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Admin Login</h2>
            <p className="text-gray-600 mt-2 text-center text-sm">Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  style={{ color: '#1f2937' }} /* Ensuring text is visible */
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  style={{ color: '#1f2937' }} /* Ensuring text is visible */
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all font-medium disabled:opacity-80"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Authenticating...
                </span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 flex flex-col items-center space-y-4">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

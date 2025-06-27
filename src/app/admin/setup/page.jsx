'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Shield, Terminal } from 'lucide-react'

export default function AdminSetup() {
  const router = useRouter()
  const [setupStatus, setSetupStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup')
      const data = await response.json()
      setSetupStatus(data)
    } catch (error) {
      console.error('Error checking setup status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!setupStatus?.setupRequired) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-amber-100">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Setup Required
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your admin account to access the admin panel
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Security Notice</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              For security reasons, admin accounts can only be created via the command line.
              This prevents unauthorized web-based account creation.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Terminal className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="text-md font-medium text-gray-900">Create Admin Account</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Run the following command in your project directory:
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm">
                  npm run create-admin
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500">
                  This command will prompt you to enter your admin credentials and create the admin account securely.
                  Once created, you can use the login page to access the admin panel.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={checkSetupStatus}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Check Setup Status
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}

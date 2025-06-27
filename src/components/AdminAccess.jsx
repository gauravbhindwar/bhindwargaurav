'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Settings, Lock, User } from 'lucide-react'

export default function AdminAccess() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(false)

  // Only show for authenticated admin users or when explicitly requested
  if (!isVisible && !session?.user) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors opacity-20 hover:opacity-100"
          title="Admin Access"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-2 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">Admin Panel</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Admin Access</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2">
          <Link
            href="/admin/login"
            className="flex items-center space-x-2 w-full p-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Lock className="h-4 w-4" />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Code, 
  Award, 
  BookOpen, 
  Mail, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings,
  Users,
  ExternalLink,
  Eye
} from 'lucide-react'
import AdminProtection from './AdminProtection'

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen
  },
  {
    name: 'Skills',
    href: '/admin/skills',
    icon: Code
  },
  {
    name: 'Certifications',
    href: '/admin/certifications',
    icon: Award
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: BookOpen
  },
  {
    name: 'Contact',
    href: '/admin/contact',
    icon: Mail
  },
  {
    name: 'Admins',
    href: '/admin/admins',
    icon: Users
  }
]

export default function AdminLayout({ children }) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)

  // ESC key handler for closing modals
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (showPortfolioModal) {
          setShowPortfolioModal(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [showPortfolioModal])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handlePortfolioClick = () => {
    setShowPortfolioModal(true)
  }

  const openPortfolio = (newTab = false) => {
    const portfolioUrl = '/'
    if (newTab) {
      window.open(portfolioUrl, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = portfolioUrl
    }
    setShowPortfolioModal(false)
  }

  return (
    <AdminProtection>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto mt-6 px-3">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 pb-6">
              <button
                onClick={handlePortfolioClick}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors mb-4"
              >
                <Eye className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                View Portfolio
              </button>
              
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <User className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">{session?.user?.username}</div>
                  <div className="text-xs text-gray-500">{session?.user?.email}</div>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0 flex flex-col h-full">
          {/* Top bar */}
          <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex-1 lg:flex lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    {sidebarItems.find(item => item.href === pathname)?.name || 'Admin'}
                  </h2>
                </div>
                
                <div className="hidden lg:flex lg:items-center lg:space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{session?.user?.username}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content - Scrollable area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Portfolio Modal */}
        {showPortfolioModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  View Portfolio
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  How would you like to open your portfolio?
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => openPortfolio(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => openPortfolio(false)}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Open in Current Tab
                  </button>
                  <button
                    onClick={() => setShowPortfolioModal(false)}
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  )
}

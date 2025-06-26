'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FolderOpen, 
  Code, 
  Award, 
  Mail, 
  BookOpen, 
  Home,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  BarChart3
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Add admin class to body for admin-specific styling
    document.body.classList.add('admin-layout')
    document.body.setAttribute('data-layout', 'admin')
    
    return () => {
      document.body.classList.remove('admin-layout')
      document.body.removeAttribute('data-layout')
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Skills', href: '/admin/skills', icon: Code },
    { name: 'Certifications', href: '/admin/certifications', icon: Award },
    { name: 'Contact', href: '/admin/contact', icon: Mail },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:w-64 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
          <Link href="/admin/dashboard" className="text-white font-bold text-xl">
            Admin Panel
          </Link>
          <button
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="px-4 space-y-2">
              <Link
                href="/"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Home className="mr-3 h-5 w-5 text-gray-400" />
                View Portfolio
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:flex lg:flex-col lg:overflow-hidden">
        {/* Top header */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 lg:static">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  className="text-gray-500 hover:text-gray-900 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="ml-4 lg:ml-0">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {navigation.find(nav => nav.href === pathname)?.name || 'Admin'}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{session?.user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

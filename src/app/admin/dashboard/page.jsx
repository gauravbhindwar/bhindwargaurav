'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certifications: 0,
    courses: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const [projectsRes, skillsRes, certificationsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/certifications')
      ])

      const [projectsData, skillsData, certificationsData] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        certificationsRes.json()
      ])

      setStats({
        projects: projectsData.projects?.length || 0,
        skills: skillsData.categories?.reduce((total, category) => total + category.skills.length, 0) || 0,
        certifications: certificationsData.certifications?.length || 0,
        courses: skillsData.courses ? Object.values(skillsData.courses).flat().length : 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const menuItems = [
    {
      title: 'Projects',
      description: 'Manage your portfolio projects',
      count: stats.projects,
      href: '/admin/projects',
      color: 'bg-blue-500'
    },
    {
      title: 'Skills',
      description: 'Manage your skills and technologies',
      count: stats.skills,
      href: '/admin/skills',
      color: 'bg-green-500'
    },
    {
      title: 'Certifications',
      description: 'Manage your certifications',
      count: stats.certifications,
      href: '/admin/certifications',
      color: 'bg-purple-500'
    },
    {
      title: 'Contact',
      description: 'Manage your contact information',
      count: '1', // There's only one contact record
      href: '/admin/contact',
      color: 'bg-indigo-500'
    },
    {
      title: 'Courses',
      description: 'Manage your courses',
      count: stats.courses,
      href: '/admin/courses',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Portfolio
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {menuItems.map((item) => (
              <div key={item.title} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-md ${item.color}`}></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {item.count}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{item.count}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Manage {item.title} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/projects"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add New Project
                </Link>
                <Link
                  href="/admin/skills"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Add New Skill
                </Link>
                <Link
                  href="/admin/certifications"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  Add Certification
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

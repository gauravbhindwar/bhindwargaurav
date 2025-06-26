'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FolderOpen, 
  Code, 
  Award, 
  Mail, 
  BookOpen, 
  TrendingUp, 
  Eye, 
  Activity,
  Github
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certifications: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity] = useState([
    {
      title: 'Updated React Portfolio Project',
      description: 'Modified project description and added new features',
      time: '2 hours ago',
      type: 'project'
    },
    {
      title: 'Added Next.js Skill',
      description: 'Added Next.js to frontend development skills',
      time: '1 day ago',
      type: 'skill'
    },
    {
      title: 'AWS Certification Added',
      description: 'Added AWS Solutions Architect certification',
      time: '3 days ago',
      type: 'certification'
    }
  ])

  useEffect(() => {
    fetchStats()
  }, [])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statsData = [
    {
      title: 'Total Projects',
      value: stats.projects,
      change: '+12% from last month',
      icon: FolderOpen,
      color: 'bg-blue-500',
      href: '/admin/projects'
    },
    { 
      title: 'Skills',
      value: stats.skills,
      change: '+8% from last month',
      icon: Code,
      color: 'bg-green-500',
      href: '/admin/skills'
    },
    {
      title: 'Certifications',
      value: stats.certifications,
      change: '+5% from last month',
      icon: Award,
      color: 'bg-purple-500',
      href: '/admin/certifications'
    },
    {
      title: 'Courses',
      value: stats.courses,
      change: '+3% from last month',
      icon: BookOpen,
      color: 'bg-orange-500',
      href: '/admin/courses'
    }
  ]
  
  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Add a new project to your portfolio showcase',
      icon: FolderOpen,
      color: 'bg-blue-500',
      href: '/admin/projects',
      action: 'Add Project'
    },
    {
      title: 'Add Skills',
      description: 'Update your technical skills and expertise',
      icon: Code,
      color: 'bg-green-500',
      href: '/admin/skills',
      action: 'Manage Skills'
    },
    {
      title: 'New Certification',
      description: 'Add your latest certification or achievement',
      icon: Award,
      color: 'bg-purple-500',
      href: '/admin/certifications',
      action: 'Add Certification'
    },
    {
      title: 'Update Contact',
      description: 'Manage your contact information and social links',
      icon: Mail,
      color: 'bg-indigo-500',
      href: '/admin/contact',
      action: 'Update Contact'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your portfolio today</p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <span className="text-sm text-gray-500">Manage your content</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href} className="group">
                  <div className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        <div className="mt-3">
                          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                            {action.action} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'project' ? 'bg-blue-500' :
                    item.type === 'skill' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'project' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'skill' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Portfolio Overview</h2>
            <p className="text-gray-600 mt-1">Your public portfolio performance</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Live
            </Link>
            <Link
              href="https://github.com/yourusername"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-900">
              {stats.projects + stats.skills + stats.certifications}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Items</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-sm text-gray-600 mt-1">Completion Rate</div>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">Live</div>
            <div className="text-sm text-gray-600 mt-1">Status</div>
          </div>
        </div>
      </div>
    </div>
  );
}

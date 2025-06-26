'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import AdminProtection from '@/components/AdminProtection';
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

export default function AdminDashboardPage() {
  return (
    <AdminProtection>
      <AdminDashboard />
    </AdminProtection>
  );
}

function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certifications: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!session) return;
      
      try {
        // Initialize with empty data structures
        let projectsData = { projects: [] };
        let skillsData = { categories: [], courses: {} };
        let certificationsData = { certifications: [] };
        
        // Fetch data one by one with proper error handling
        try {
          const projectsRes = await fetch('/api/projects');
          if (projectsRes.ok) {
            projectsData = await projectsRes.json();
          }
        } catch (err) {
          console.error('Error fetching projects:', err);
        }
        
        try {
          const skillsRes = await fetch('/api/skills');
          if (skillsRes.ok) {
            skillsData = await skillsRes.json();
          }
        } catch (err) {
          console.error('Error fetching skills:', err);
        }
        
        try {
          const certificationsRes = await fetch('/api/certifications');
          if (certificationsRes.ok) {
            certificationsData = await certificationsRes.json();
          }
        } catch (err) {
          console.error('Error fetching certifications:', err);
        }
        
        // Safely access data with proper checks
        setStats({
          projects: Array.isArray(projectsData?.projects) ? projectsData.projects.length : 0,
          skills: Array.isArray(skillsData?.categories) ? 
            skillsData.categories.reduce((total, category) => 
              total + (Array.isArray(category?.skills) ? category.skills.length : 0), 0) : 0,
          certifications: Array.isArray(certificationsData?.certifications) ? 
            certificationsData.certifications.length : 0,
          courses: skillsData?.courses ? 
            Object.values(skillsData.courses).reduce((total, courseList) => 
              total + (Array.isArray(courseList) ? courseList.length : 0), 0) : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [session]);

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
  ];
  
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
  ];

  const recentActivity = [
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
  ];

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
          <Link href={stat.href} key={stat.title}>
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
                <div className={`${stat.color} p-4 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <div key={action.title} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all hover:shadow-md">
              <div className="p-5">
                <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <action.icon className="text-white w-6 h-6" />
                </div>
                <h3 className="font-medium text-gray-900">{action.title}</h3>
                <p className="text-gray-600 mt-1 text-sm">{action.description}</p>
                <div className="mt-4">
                  <Link href={action.href}>
                    <span className="text-blue-600 font-medium text-sm hover:underline">{action.action} →</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50">
                <div className={`p-2 rounded-full ${
                  activity.type === 'project' ? 'bg-blue-100 text-blue-600' : 
                  activity.type === 'skill' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                } mr-4`}>
                  {activity.type === 'project' && <FolderOpen className="w-5 h-5" />}
                  {activity.type === 'skill' && <Code className="w-5 h-5" />}
                  {activity.type === 'certification' && <Award className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{activity.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Public Portfolio Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Public Portfolio</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-gray-700 mr-3" />
                <span className="text-gray-700">Page Views</span>
              </div>
              <span className="font-bold text-gray-900">1,248</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <Github className="w-5 h-5 text-gray-700 mr-3" />
                <span className="text-gray-700">GitHub Views</span>
              </div>
              <span className="font-bold text-gray-900">743</span>
            </div>
            <div className="mt-6">
              <Link href="/" target="_blank" className="flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                <Eye className="w-4 h-4 mr-2" />
                View Public Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

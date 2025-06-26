'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCourses() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to skills page since courses are managed there
    router.push('/admin/skills')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">Courses are managed in the Skills section.</p>
      </div>
    </div>
  )
}

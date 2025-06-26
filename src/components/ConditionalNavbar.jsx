'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  
  useEffect(() => {
    // Add/remove admin class based on route
    if (isAdminRoute) {
      document.body.classList.add('admin-layout')
      document.body.setAttribute('data-layout', 'admin')
    } else {
      document.body.classList.remove('admin-layout')
      document.body.removeAttribute('data-layout')
    }
    
    return () => {
      document.body.classList.remove('admin-layout')
      document.body.removeAttribute('data-layout')
    }
  }, [isAdminRoute])
  
  // Hide navbar on admin routes
  if (isAdminRoute) {
    return null
  }
  
  return <Navbar />
}

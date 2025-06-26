'use client'

import { useEffect } from 'react'

export default function AdminLayout({ children }) {
  useEffect(() => {
    // Add admin class to body for admin-specific styling
    document.body.classList.add('admin-layout')
    document.body.setAttribute('data-layout', 'admin')
    
    return () => {
      document.body.classList.remove('admin-layout')
      document.body.removeAttribute('data-layout')
    }
  }, [])

  return (
    <div className="admin-container">
      {children}
    </div>
  )
}

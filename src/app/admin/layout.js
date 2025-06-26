'use client'

import { usePathname } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'

export default function AdminPageLayout({ children }) {
  const pathname = usePathname()
  
  // Don't apply layout to login page
  if (pathname?.includes('/admin/login')) {
    return children
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

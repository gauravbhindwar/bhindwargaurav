'use client'

import { usePathname } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'

export default function AdminPageLayout({ children }) {
  const pathname = usePathname()
  
  // Don't apply layout to login and setup pages
  if (pathname?.includes('/admin/login') || pathname?.includes('/admin/setup')) {
    return children
  }

  // All other admin pages get the full admin layout with protection
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}

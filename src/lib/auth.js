import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

/**
 * Check if the current user is an authenticated admin
 * @returns {Promise<boolean>} True if user is authenticated admin, false otherwise
 */
export async function checkAdminAuth() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return false
    }
    
    // Check if user has admin or super_admin role
    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

/**
 * Get the current admin session
 * @returns {Promise<Object|null>} Session object if authenticated admin, null otherwise
 */
export async function getAdminSession() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return null
    }
    
    // Check if user has admin or super_admin role
    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
      return null
    }
    
    return session
  } catch (error) {
    console.error('Session get error:', error)
    return null
  }
}

/**
 * Middleware function to protect API routes
 * @param {Function} handler - The API route handler function
 * @returns {Function} Protected API route handler
 */
export function withAdminAuth(handler) {
  return async function protectedHandler(request, context) {
    const isAdmin = await checkAdminAuth()
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }
    
    return handler(request, context)
  }
}

/**
 * Check authentication and return appropriate error response if not authenticated
 * @returns {Promise<NextResponse|null>} Error response if not authenticated, null if authenticated
 */
export async function requireAdminAuth() {
  const isAdmin = await checkAdminAuth()
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' },
      { status: 401 }
    )
  }
  
  return null
}

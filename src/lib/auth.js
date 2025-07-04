import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'admin@example.com'
        },
        password: { 
          label: 'Password', 
          type: 'password' 
        }
      },
      async authorize(credentials) {
        try {
          await connectToDatabase()
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          // Find admin by email
          const admin = await Admin.findOne({ 
            email: credentials.email.toLowerCase(),
            isActive: true 
          })

          if (!admin) {
            throw new Error('Invalid credentials')
          }

          // Check password
          const isValidPassword = await bcrypt.compare(
            credentials.password, 
            admin.password
          )

          if (!isValidPassword) {
            throw new Error('Invalid credentials')
          }

          // Update last login
          await Admin.findByIdAndUpdate(admin._id, {
            lastLogin: new Date()
          })

          return {
            id: admin._id.toString(),
            email: admin.email,
            username: admin.username,
            role: admin.role
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.role = token.role
      session.user.username = token.username
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

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

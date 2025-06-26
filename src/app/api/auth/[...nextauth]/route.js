import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth - NEXTAUTH_SECRET available:', !!process.env.NEXTAUTH_SECRET)
        console.log('NextAuth - Authorize called with username:', credentials?.username)
        
        if (!credentials?.username || !credentials?.password) {
          console.error('Auth error: Missing credentials')
          throw new Error('Username and password are required')
        }

        try {
          await connectToDatabase()
          console.log('Database connected, looking for admin with username/email:', credentials.username)
          
          const admin = await Admin.findOne({
            $or: [
              { username: credentials.username },
              { email: credentials.username }
            ]
          })

          console.log('Admin found:', admin ? 'Yes' : 'No')
          
          if (!admin) {
            console.error('Auth error: No admin found with username/email:', credentials.username)
            throw new Error('Invalid credentials')
          }

          if (!admin.isActive) {
            console.error('Auth error: Admin account is inactive')
            throw new Error('Invalid credentials')
          }

          console.log('Comparing password...')
          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password)
          console.log('Password valid:', isPasswordValid)
          
          if (!isPasswordValid) {
            console.error('Auth error: Password does not match')
            throw new Error('Invalid credentials')
          }

          // Update last login
          await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() })
          
          console.log('Auth successful, returning user data with role:', admin.role)
          return {
            id: admin._id.toString(),
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        } catch (error) {
          console.error('Auth error details:', error.message)
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
        token.id = user.id
        console.log('JWT callback - User data stored in token')
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || token.sub
        session.user.role = token.role
        session.user.username = token.username
        console.log('Session callback - Session created for user:', session.user.username)
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - URL:', url, 'BaseURL:', baseUrl)
      // Handle admin login redirects properly
      if (url.includes('/admin/login') || url.includes('/admin/dashboard')) {
        return `${baseUrl}/admin/dashboard`
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/admin/dashboard`
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  // Add explicit URL configuration for production
  ...(process.env.NEXTAUTH_URL && {
    url: process.env.NEXTAUTH_URL
  })
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

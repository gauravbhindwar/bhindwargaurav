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
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username and password are required')
        }

        try {
          await connectToDatabase()
          
          const admin = await Admin.findOne({
            $or: [
              { username: credentials.username },
              { email: credentials.username }
            ]
          })

          if (!admin || !admin.isActive) {
            throw new Error('Invalid credentials')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password)
          
          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          // Update last login
          await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() })

          return {
            id: admin._id.toString(),
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        } catch (error) {
          console.error('Auth error:', error)
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
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.username = token.username
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

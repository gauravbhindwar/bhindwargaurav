import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/models/Admin';

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
          throw new Error('Username and password are required');
        }

        try {
          await connectToDatabase();
          
          // Find admin by username or email
          const admin = await Admin.findOne({
            $or: [
              { username: credentials.username },
              { email: credentials.username }
            ]
          });
          
          if (!admin || !admin.isActive) {
            throw new Error('Invalid credentials');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          // Update last login timestamp (non-blocking)
          Admin.findByIdAndUpdate(admin._id, { 
            lastLogin: new Date() 
          }).catch(error => {
            console.warn('Failed to update last login timestamp:', error.message);
          });
          
          // Return user data
          return {
            id: admin._id.toString(),
            username: admin.username,
            email: admin.email,
            role: admin.role
          };
        } catch (error) {
          console.error('Authentication error:', error.message);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  // Use JWT for server-side sessions
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // JWT Configuration
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    // Add user details to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    // Add token details to session
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role,
        username: token.username,
        email: token.email || session.user?.email
      };
      return session;
    },
    // Handle redirects
    async redirect({ url, baseUrl }) {
      // If the URL is relative, prepend the base URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If the URL is on the same origin, allow it
      else if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default to admin dashboard
      return `${baseUrl}/admin/dashboard`;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login'
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

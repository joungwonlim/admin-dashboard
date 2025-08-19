import { NextAuthOptions } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        try {
          // Validate input
          const validatedCredentials = credentialsSchema.parse(credentials)

          // Find user in database
          const user = await db.select().from(users).where(eq(users.email, validatedCredentials.email)).limit(1)

          if (!user.length) {
            console.log('User not found:', validatedCredentials.email)
            return null
          }

          const foundUser = user[0]

          // For demo purposes, we'll create a simple password check
          // In production, you should hash passwords properly
          if (validatedCredentials.password === 'admin123') {
            return {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role,
              image: foundUser.image
            }
          }

          console.log('Invalid password for user:', validatedCredentials.email)
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Include role in JWT token
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Include role in session
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', user.email)
    },
    async signOut({ session, token }) {
      console.log('User signed out')
    }
  }
}

// Helper function to get server session
export async function getServerSession() {
  const { getServerSession } = await import('next-auth')
  return getServerSession(authOptions)
}

// Helper function to check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole)
}

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  admin: ['admin', 'manager', 'viewer'],
  manager: ['manager', 'viewer'],
  viewer: ['viewer']
} as const

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const userPermissions = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || []
  return userPermissions.includes(requiredRole)
}

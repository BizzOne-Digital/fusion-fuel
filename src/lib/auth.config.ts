import type { NextAuthConfig } from 'next-auth';
import type { AdminRole } from '@/types';

/**
 * Edge-safe NextAuth config (no Mongoose, bcrypt, or other Node-only imports).
 * Used by middleware; providers are added in auth.ts.
 */
export const authConfig = {
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.adminRole = user.adminRole;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'customer';
        session.user.adminRole = token.adminRole as AdminRole | undefined;
        session.user.isEmailVerified = token.isEmailVerified as boolean | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

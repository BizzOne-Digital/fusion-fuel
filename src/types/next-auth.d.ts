import type { DefaultSession } from 'next-auth';
import type { AdminRole } from '@/types';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: 'admin' | 'customer';
    adminRole?: AdminRole;
    isEmailVerified?: boolean;
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'admin' | 'customer';
    adminRole?: AdminRole;
    isEmailVerified?: boolean;
  }
}

export {};
